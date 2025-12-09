USE BKExpress;
GO

IF OBJECT_ID('dbo.f_TinhThuongTaiXeNT', 'FN') IS NOT NULL 
    DROP FUNCTION dbo.f_TinhThuongTaiXeNT;
GO

CREATE FUNCTION dbo.f_TinhThuongTaiXeNT(@p_cccd VARCHAR(12)) 
RETURNS DECIMAL(15, 0)
AS
BEGIN
    -- 1. Khai báo biến
    DECLARE @v_tong_thuong DECIMAL(15, 0) = 0;
    DECLARE @v_ma_don VARCHAR(20);
    DECLARE @v_tong_so_luong_hang INT = 0;
    DECLARE @v_so_luong_mot_don INT = 0;
    DECLARE @v_so_luong_vuot INT = 0;
    DECLARE @v_check_exists INT;

    -- Validate: Kiểm tra tài xế có tồn tại trong bảng Tài xế Nội thành không
    SELECT @v_check_exists = COUNT(*) FROM Tai_xe_noi_thanh WHERE CCCD = @p_cccd;
    IF @v_check_exists = 0 RETURN -1;

    -- 2. Khai báo CURSOR lấy danh sách các đơn hàng tài xế đã nhận
    DECLARE cur_don_hang CURSOR FOR 
        SELECT Ma_don 
        FROM Tai_xe_NT_Van_chuyen_Hang_hoa 
        WHERE CCCD = @p_cccd;

    -- 3. Mở con trỏ và bắt đầu tính tổng số lượng hàng
    OPEN cur_don_hang;
    FETCH NEXT FROM cur_don_hang INTO @v_ma_don;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Tính số lượng hàng trong từng đơn
        SELECT @v_so_luong_mot_don = ISNULL(SUM(so_luong), 0)
        FROM Hang_hoa
        WHERE Ma_don = @v_ma_don;

        -- Cộng dồn
        SET @v_tong_so_luong_hang = @v_tong_so_luong_hang + @v_so_luong_mot_don;

        FETCH NEXT FROM cur_don_hang INTO @v_ma_don;
    END;

    CLOSE cur_don_hang;
    DEALLOCATE cur_don_hang;

    -- 4. Logic thưởng mới:
    -- Nếu tổng hàng hóa > 23 thì thưởng 10k cho mỗi món vượt
    IF @v_tong_so_luong_hang > 23
    BEGIN
        SET @v_so_luong_vuot = @v_tong_so_luong_hang - 23;
        SET @v_tong_thuong = @v_so_luong_vuot * 10000;
    END
    ELSE
    BEGIN
        SET @v_tong_thuong = 0; -- Không thưởng nếu chưa đạt chỉ tiêu
    END

    RETURN @v_tong_thuong;
END;
GO

-- ==================================================================================
-- HÀM 2: TÍNH CƯỚC PHÍ ĐƠN HÀNG (f_TinhCuocPhiDonHang)
-- ==================================================================================
IF OBJECT_ID('dbo.f_TinhCuocPhiDonHang', 'FN') IS NOT NULL DROP FUNCTION dbo.f_TinhCuocPhiDonHang;
GO

CREATE FUNCTION dbo.f_TinhCuocPhiDonHang(@p_ma_don VARCHAR(20)) 
RETURNS DECIMAL(15, 2)
AS
BEGIN
    DECLARE @v_tong_trong_luong_kg FLOAT = 0;
    DECLARE @v_cuoc_phi DECIMAL(15, 2) = 0;
    DECLARE @v_tong_thanh_toan DECIMAL(15, 2) = 0;
    
    DECLARE @v_str_khoi_luong VARCHAR(50);
    DECLARE @v_loai_hang VARCHAR(50);
    DECLARE @v_so_luong INT;
    DECLARE @v_gia_tri_so FLOAT;
    DECLARE @v_don_vi VARCHAR(20);
    DECLARE @v_phu_phi_an_toan DECIMAL(15, 2) = 0;
    
    DECLARE @v_space_index INT; -- Biến hỗ trợ cắt chuỗi
    DECLARE @v_co_bao_hiem BIT;
    DECLARE @v_tuy_chon_giao_hang VARCHAR(50);
    DECLARE @v_check INT;

    -- Lấy thông tin Header đơn hàng
    SELECT @v_check = COUNT(*), 
           @v_co_bao_hiem = CAST(bao_hiem AS BIT), 
           @v_tuy_chon_giao_hang = tuy_chon_giao_hang
    FROM Don_van_chuyen 
    WHERE Ma_don = @p_ma_don
    GROUP BY bao_hiem, tuy_chon_giao_hang;

    IF @v_check = 0 RETURN -1;

    DECLARE cur_hang_hoa CURSOR FOR 
        SELECT khoi_luong, so_luong, loai_hang FROM Hang_hoa WHERE Ma_don = @p_ma_don;

    OPEN cur_hang_hoa;
    FETCH NEXT FROM cur_hang_hoa INTO @v_str_khoi_luong, @v_so_luong, @v_loai_hang;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- XỬ LÝ CHUỖI: "10 kg" -> Lấy 10 và kg
        SET @v_str_khoi_luong = LTRIM(RTRIM(@v_str_khoi_luong));
        SET @v_space_index = CHARINDEX(' ', @v_str_khoi_luong);

        IF @v_space_index > 0
        BEGIN
            SET @v_gia_tri_so = CAST(LEFT(@v_str_khoi_luong, @v_space_index - 1) AS FLOAT);
            SET @v_don_vi = LTRIM(SUBSTRING(@v_str_khoi_luong, @v_space_index + 1, LEN(@v_str_khoi_luong)));
        END
        ELSE
        BEGIN
            SET @v_gia_tri_so = CAST(@v_str_khoi_luong AS FLOAT);
            SET @v_don_vi = 'kg';
        END

        -- Quy đổi
        IF @v_don_vi = 'ta' SET @v_gia_tri_so = @v_gia_tri_so * 100;
        ELSE IF @v_don_vi = 'tan' SET @v_gia_tri_so = @v_gia_tri_so * 1000;
        
        -- Cộng dồn
        SET @v_tong_trong_luong_kg = @v_tong_trong_luong_kg + (@v_gia_tri_so * @v_so_luong);

        -- Phụ phí
        IF @v_loai_hang IN ('Do Dien Tu', 'Hang De Vo')
            SET @v_phu_phi_an_toan = @v_phu_phi_an_toan + (50000 * @v_so_luong);

        FETCH NEXT FROM cur_hang_hoa INTO @v_str_khoi_luong, @v_so_luong, @v_loai_hang;
    END;

    CLOSE cur_hang_hoa;
    DEALLOCATE cur_hang_hoa;

    -- Tính cước
    IF @v_tong_trong_luong_kg <= 100
        SET @v_cuoc_phi = @v_tong_trong_luong_kg * 10000;
    ELSE IF @v_tong_trong_luong_kg <= 500
        SET @v_cuoc_phi = @v_tong_trong_luong_kg * 8000;
    ELSE
        SET @v_cuoc_phi = @v_tong_trong_luong_kg * 5000;

    SET @v_tong_thanh_toan = @v_cuoc_phi + @v_phu_phi_an_toan;

    -- Bảo hiểm & Hỏa tốc
    IF @v_co_bao_hiem = 1 SET @v_tong_thanh_toan = @v_tong_thanh_toan + 15000;
    IF @v_tuy_chon_giao_hang LIKE N'%hoa toc%' OR @v_tuy_chon_giao_hang LIKE N'%hỏa tốc%'
        SET @v_tong_thanh_toan = @v_tong_thanh_toan * 2;

    RETURN @v_tong_thanh_toan;
END;
GO