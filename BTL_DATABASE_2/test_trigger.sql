USE BKExpress;
GO

PRINT '=== BAT DAU KIEM THU (TEST SCRIPT) ===';
PRINT ' ';

-- ==============================================================================
-- PHẦN A: TEST TRIGGER LƯƠNG & RÀNG BUỘC
-- ==============================================================================
PRINT '--- PHAN A: TEST TRIGGER LUONG ---';

-- 1. TEST LỖI NHẬP LIỆU (NEGATIVE TEST)
-- Mục tiêu: Lương NV Kho (20tr) > Lương QL (10tr) -> Phải báo lỗi
PRINT '1. Test nhap luong sai (Mong doi: Bao loi do)';
BEGIN TRY
    INSERT INTO NhanVien (CCCD, ho_ten, sdt, STK, ma_TK, chuc_vu, luong_co_ban, so_ngay_lam_viec) 
    VALUES ('NV_TEST_01', 'Nguyen Van Test', '0999888777', '123456', NULL, 'NhanVienKho', 20000000, 26);
END TRY
BEGIN CATCH
    PRINT N'   -> THANH CONG: He thong da chan loi: ' + ERROR_MESSAGE();
END CATCH;

-- 2. INSERT THÀNH CÔNG & TỰ ĐỘNG TÍNH LƯƠNG
-- Mục tiêu: Lương 5tr -> OK. Lương tính ra = 5tr.
PRINT '2. Test Insert dung (Mong doi: Insert duoc & luong = 5tr)';
INSERT INTO NhanVien (CCCD, ho_ten, sdt, STK, ma_TK, chuc_vu, luong_co_ban, so_ngay_lam_viec) 
VALUES ('NV_TEST_01', 'Nguyen Van Test', '0999888777', '123456', NULL, 'NhanVienKho', 5000000, 26);

SELECT CCCD, ho_ten, luong_co_ban, so_ngay_lam_viec, CAST(luong AS DECIMAL(15,0)) as [Luong_Tinh_Toan]
FROM NhanVien WHERE CCCD = 'NV_TEST_01';

-- 3. UPDATE TĂNG CA
-- Mục tiêu: 30 ngày -> Lương tăng (OT)
PRINT '3. Test Update Tang ca (Mong doi: Luong > 5tr)';
UPDATE NhanVien SET so_ngay_lam_viec = 30 WHERE CCCD = 'NV_TEST_01';

SELECT CCCD, ho_ten, so_ngay_lam_viec, CAST(luong AS DECIMAL(15,0)) as [Luong_Sau_Khi_Tang_Ca]
FROM NhanVien WHERE CCCD = 'NV_TEST_01';

PRINT ' ';

-- ==============================================================================
-- PHẦN B: TEST TRIGGER PHÂN CÔNG XE & TÀI XẾ
-- ==============================================================================
PRINT '--- PHAN B: TEST PHAN CONG ---';

-- 1. KHỞI TẠO DỮ LIỆU SẠCH
-- Xóa dữ liệu cũ nếu có để tránh lỗi trùng khóa
DELETE FROM TaixeLT_Vanchuyen_Chuyenhang WHERE Ma_chuyen_hang LIKE 'CH_TEST%';
DELETE FROM Phuongtien_Vanchuyen_Chuyenhang WHERE Ma_chuyen_hang LIKE 'CH_TEST%';
DELETE FROM Tai_xe_lien_tinh WHERE CCCD = '999999999';
DELETE FROM Phuong_tien_van_chuyen WHERE bien_so_xe = 'TEST-9999';
DELETE FROM TaiXe WHERE CCCD = '999999999';
DELETE FROM NhanVien WHERE CCCD = '999999999';
DELETE FROM TaiKhoan WHERE username = 'tx_test_trigger';

-- Tạo dữ liệu mới
INSERT INTO TaiKhoan (username, password) VALUES ('tx_test_trigger', '123');
INSERT INTO NhanVien (CCCD, ho_ten, sdt, STK, ma_TK, chuc_vu, luong_co_ban, so_ngay_lam_viec, dia_chi) 
VALUES ('999999999', 'Tai Xe Test Trigger', '0999888999', '00000001', (SELECT ma_TK FROM TaiKhoan WHERE username = 'tx_test_trigger'), 'TaiXeLienTinh', 5000000, 26, 'Phong Test');
INSERT INTO TaiXe (CCCD, bang_lai_xe) VALUES ('999999999', 'FC');
INSERT INTO Tai_xe_lien_tinh (CCCD, trang_thai, ma_kho_lam_viec) VALUES ('999999999', 'SanSang', 'KHO_HN');
INSERT INTO Phuong_tien_van_chuyen (bien_so_xe, trang_thai, tai_trong_tan, loai_xe, vi_tri_do) VALUES ('TEST-9999', 'SanSang', 10, 'Container', 'Bai Xe Test');

IF NOT EXISTS (SELECT * FROM Chuyen_hang WHERE Ma_chuyen_hang = 'CH_TEST_NEW_1')
    INSERT INTO Chuyen_hang (Ma_chuyen_hang, Dia_chi_giao, Dia_chi_nhan_hang) VALUES ('CH_TEST_NEW_1', 'HN', 'HP'), ('CH_TEST_NEW_2', 'HN', 'ND');

-- 2. PHÂN CÔNG THÀNH CÔNG
PRINT '4. Phan cong Tai xe & Xe (Mong doi: Trang thai chuyen sang DangVanChuyen)';
INSERT INTO TaixeLT_Vanchuyen_Chuyenhang (Ma_chuyen_hang, CCCD) VALUES ('CH_TEST_NEW_1', '999999999');
INSERT INTO Phuongtien_Vanchuyen_Chuyenhang (Ma_chuyen_hang, Bien_so_xe) VALUES ('CH_TEST_NEW_1', 'TEST-9999');

SELECT CCCD, trang_thai FROM Tai_xe_lien_tinh WHERE CCCD = '999999999';
SELECT bien_so_xe, trang_thai FROM Phuong_tien_van_chuyen WHERE bien_so_xe = 'TEST-9999';

-- 3. TEST LỖI BẬN
PRINT '5. Test phan cong khi dang ban (Mong doi: Bao loi do)';
BEGIN TRY
    INSERT INTO TaixeLT_Vanchuyen_Chuyenhang (Ma_chuyen_hang, CCCD) VALUES ('CH_TEST_NEW_2', '999999999');
END TRY
BEGIN CATCH
    PRINT N'   -> THANH CONG: Chan Tai Xe Ban: ' + ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    INSERT INTO Phuongtien_Vanchuyen_Chuyenhang (Ma_chuyen_hang, Bien_so_xe) VALUES ('CH_TEST_NEW_2', 'TEST-9999');
END TRY
BEGIN CATCH
    PRINT N'   -> THANH CONG: Chan Phuong Tien Ban: ' + ERROR_MESSAGE();
END CATCH;
GO