USE BKExpress;
GO

-- =============================================================
-- TRIGGER 1: TỰ ĐỘNG TÍNH LƯƠNG (GỘP INSERT & UPDATE)
-- Trong SQL Server, dùng AFTER TRIGGER để cập nhật lại giá trị
-- =============================================================
IF OBJECT_ID('tg_TinhLuong', 'TR') IS NOT NULL DROP TRIGGER tg_TinhLuong;
GO

CREATE TRIGGER tg_TinhLuong
ON NhanVien
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Chỉ chạy khi có thay đổi liên quan đến lương hoặc ngày làm
    IF UPDATE(so_ngay_lam_viec) OR UPDATE(luong_co_ban)
    BEGIN
        -- Cập nhật lại chính bảng NhanVien dựa trên dữ liệu vừa vào (inserted)
        UPDATE nv
        SET nv.luong = CASE 
            -- Nếu làm <= 26 ngày
            WHEN ISNULL(i.so_ngay_lam_viec, 0) <= 26 THEN 
                (ISNULL(i.luong_co_ban, 0) / 26.0) * ISNULL(i.so_ngay_lam_viec, 0)
            -- Nếu làm > 26 ngày (Tính OT hệ số 1.5)
            ELSE 
                ((ISNULL(i.luong_co_ban, 0) / 26.0) * 26) + 
                ((ISNULL(i.luong_co_ban, 0) / 26.0) * 1.5 * (ISNULL(i.so_ngay_lam_viec, 0) - 26))
            END
        FROM NhanVien nv
        INNER JOIN inserted i ON nv.CCCD = i.CCCD;
    END
END;
GO

-- =============================================================
-- TRIGGER 2: KIỂM TRA RÀNG BUỘC LƯƠNG (VALIDATION)
-- Logic: Nếu lương NV >= Lương Quản lý -> Rollback
-- =============================================================
IF OBJECT_ID('tg_KiemTraLuongDauVao', 'TR') IS NOT NULL DROP TRIGGER tg_KiemTraLuongDauVao;
GO

CREATE TRIGGER tg_KiemTraLuongDauVao
ON NhanVien
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @min_luong_ql DECIMAL(15,0);
    DECLARE @msg_error NVARCHAR(255);
    DECLARE @chuc_vu VARCHAR(50);
    DECLARE @luong_nv DECIMAL(15,0);

    SELECT @chuc_vu = chuc_vu, @luong_nv = luong_co_ban FROM inserted;

    -- 1. Kiểm tra Nhân viên kho
    IF @chuc_vu = 'NhanVienKho'
    BEGIN
        SELECT @min_luong_ql = MIN(luong_co_ban) FROM NhanVien WHERE chuc_vu = 'QuanLyKho';
        
        IF @min_luong_ql IS NOT NULL AND @luong_nv >= @min_luong_ql
        BEGIN
            SET @msg_error = N'Lỗi nhập liệu: Lương NV Kho (' + CAST(@luong_nv AS NVARCHAR) + N') phải nhỏ hơn lương QL Kho (' + CAST(@min_luong_ql AS NVARCHAR) + ')';
            THROW 51000, @msg_error, 1;
            ROLLBACK TRANSACTION;
            RETURN;
        END
    END

    -- 2. Kiểm tra Tài xế nội thành
    IF @chuc_vu = 'TaiXeNoiThanh'
    BEGIN
        SELECT @min_luong_ql = MIN(luong_co_ban) FROM NhanVien WHERE chuc_vu = 'QuanLyTaiXeNoiThanh';
        
        IF @min_luong_ql IS NOT NULL AND @luong_nv >= @min_luong_ql
        BEGIN
            SET @msg_error = N'Lỗi: Lương TX Nội thành phải nhỏ hơn lương QL TX Nội thành';
            THROW 51000, @msg_error, 1;
            ROLLBACK TRANSACTION;
            RETURN;
        END
    END

    -- 3. Kiểm tra Tài xế liên tỉnh
    IF @chuc_vu = 'TaiXeLienTinh'
    BEGIN
        SELECT @min_luong_ql = MIN(luong_co_ban) FROM NhanVien WHERE chuc_vu = 'QuanLyTaiXeLienTinh';
        
        IF @min_luong_ql IS NOT NULL AND @luong_nv >= @min_luong_ql
        BEGIN
            SET @msg_error = N'Lỗi: Lương TX Liên tỉnh phải nhỏ hơn lương QL TX Liên tỉnh';
            THROW 51000, @msg_error, 1;
            ROLLBACK TRANSACTION;
            RETURN;
        END
    END
END;
GO

-- =============================================================
-- TRIGGER 3.1: QUẢN LÝ TRẠNG THÁI TÀI XẾ LIÊN TỈNH
-- =============================================================
IF OBJECT_ID('tg_PhanCongTaiXeLT', 'TR') IS NOT NULL DROP TRIGGER tg_PhanCongTaiXeLT;
GO

CREATE TRIGGER tg_PhanCongTaiXeLT
ON TaixeLT_Vanchuyen_Chuyenhang
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @trang_thai VARCHAR(50);
    DECLARE @cccd VARCHAR(12);

    SELECT @cccd = CCCD FROM inserted;
    
    -- Lấy trạng thái hiện tại
    SELECT @trang_thai = trang_thai FROM Tai_xe_lien_tinh WHERE CCCD = @cccd;

    -- Kiểm tra logic
    IF @trang_thai = 'DangVanChuyen'
    BEGIN
        THROW 51000, N'Lỗi nghiệp vụ: Tài xế này đang vận chuyển chuyến khác!', 1;
        ROLLBACK TRANSACTION;
        RETURN;
    END
    ELSE IF @trang_thai = 'NghiPhep'
    BEGIN
        THROW 51000, N'Lỗi nghiệp vụ: Tài xế đang nghỉ phép!', 1;
        ROLLBACK TRANSACTION;
        RETURN;
    END
    ELSE
    BEGIN
        -- Cập nhật trạng thái thành DangVanChuyen
        UPDATE Tai_xe_lien_tinh 
        SET trang_thai = 'DangVanChuyen' 
        WHERE CCCD = @cccd;
    END
END;
GO

-- =============================================================
-- TRIGGER 3.2: QUẢN LÝ TRẠNG THÁI PHƯƠNG TIỆN
-- =============================================================
IF OBJECT_ID('tg_PhanCongPhuongTien', 'TR') IS NOT NULL DROP TRIGGER tg_PhanCongPhuongTien;
GO

CREATE TRIGGER tg_PhanCongPhuongTien
ON Phuongtien_Vanchuyen_Chuyenhang
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @trang_thai VARCHAR(50);
    DECLARE @bien_so VARCHAR(15);

    SELECT @bien_so = Bien_so_xe FROM inserted;
    
    SELECT @trang_thai = trang_thai FROM Phuong_tien_van_chuyen WHERE bien_so_xe = @bien_so;

    IF @trang_thai = 'DangVanChuyen'
    BEGIN
        THROW 51000, N'Lỗi nghiệp vụ: Phương tiện này đang bận!', 1;
        ROLLBACK TRANSACTION;
        RETURN;
    END
    ELSE
    BEGIN
        -- Cập nhật trạng thái và xóa vị trí đỗ
        UPDATE Phuong_tien_van_chuyen 
        SET trang_thai = 'DangVanChuyen', vi_tri_do = NULL
        WHERE bien_so_xe = @bien_so;
    END
END;
GO