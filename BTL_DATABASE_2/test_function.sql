-- ==============================================================================
-- KỊCH BẢN KIỂM THỬ HÀM (TEST SCENARIO) - CHẠY TRÊN SSMS
-- ==============================================================================

-- ==============================================================================
-- CASE 1: TEST VỚI TÀI XẾ CÓ SẴN (Trong file BKE gốc)
-- Tài xế: '01928471' (Tai Xe Noi Thanh 1)
-- Dữ liệu mẫu ban đầu: Chạy đơn DON01 (Quần áo: 2 món) + DON05 (Thực phẩm: 5 món)
-- Tổng hàng = 7 món.
-- 7 <= 23 -> Thưởng = 0.
-- ==============================================================================

-- PRINT '--- 1. TEST TAI XE CO SAN (01928471) ---';

SELECT 
    CCCD, 
    ho_ten, 
    '7 mon (<= 23)' AS [Tong_Hang_Hoa_Hien_Tai],
    FORMAT(dbo.f_TinhThuongTaiXeNT(CCCD), 'N0') + ' VND' AS [Tien_Thuong_Thuc_Te],
    '0 VND' AS [Ket_Qua_Mong_Doi]
FROM NhanVien 
WHERE CCCD = '01928471';


-- ==============================================================================
-- CASE 2: TEST VỚI TÀI XẾ MỚI & 30 HÀNG HÓA
-- Mục tiêu: Tổng hàng = 30. Vượt mức = 30 - 23 = 7.
-- Thưởng = 7 * 10,000 = 70,000 VND.
-- ==============================================================================


-- A. Dọn dẹp dữ liệu cũ (nếu có)
DELETE FROM Tai_xe_NT_Van_chuyen_Hang_hoa WHERE CCCD = '888888888';
DELETE FROM Hang_hoa WHERE Ma_don = 'DON_TEST_KPI';
DELETE FROM Don_van_chuyen WHERE Ma_don = 'DON_TEST_KPI';
DELETE FROM Tai_xe_noi_thanh WHERE CCCD = '888888888';
DELETE FROM TaiXe WHERE CCCD = '888888888';
DELETE FROM NhanVien WHERE CCCD = '888888888';
DELETE FROM TaiKhoan WHERE username = 'tx_test_kpi';

-- B. Khởi tạo Tài xế mới
INSERT INTO TaiKhoan (username, password) VALUES ('tx_test_kpi', '123');

INSERT INTO NhanVien (CCCD, ho_ten, sdt, STK, ma_TK, chuc_vu, luong_co_ban, dia_chi) 
VALUES ('888888888', 'Tai Xe Test KPI', '0999000111', '000111', 
        (SELECT ma_TK FROM TaiKhoan WHERE username = 'tx_test_kpi'), 
        'TaiXeNoiThanh', 5000000, 'HCM');

INSERT INTO TaiXe (CCCD, bang_lai_xe) VALUES ('888888888', 'B2');

-- Gán vào bảng Tài xế nội thành (Dùng biển số có sẵn để tránh lỗi FK)
INSERT INTO Tai_xe_noi_thanh (CCCD, khu_vuc_hoat_dong, bien_so_xe) 
VALUES ('888888888', 'Quan 3', '29A-11111');

-- C. Tạo 1 Đơn hàng chứa 30 món hàng
INSERT INTO Don_van_chuyen (Ma_don, loai_phuong_tien, ten_nguoi_gui, dia_chi_nguoi_gui, sdt_nguoi_gui, ten_nguoi_nhan, dia_chi_nguoi_nhan, sdt_nguoi_nhan) 
VALUES ('DON_TEST_KPI', 'XeTai', 'Gui Test', 'HCM', '0909', 'Nhan Test', 'HCM', '0909');

-- Insert 30 món vào đơn này
INSERT INTO Hang_hoa (Ma_don, so_luong, loai_hang, khoi_luong, kich_thuoc) 
VALUES ('DON_TEST_KPI', 30, 'Tap Hoa', '100 kg', 'Lon');

-- D. Phân công đơn này cho tài xế mới
INSERT INTO Tai_xe_NT_Van_chuyen_Hang_hoa (Ma_don, CCCD) 
VALUES ('DON_TEST_KPI', '888888888');

-- E. Kiểm tra kết quả
SELECT 
    CCCD, 
    ho_ten, 
    '30 mon' AS [Tong_Hang_Hoa],
    FORMAT(dbo.f_TinhThuongTaiXeNT(CCCD), 'N0') + ' VND' AS [Tien_Thuong_Thuc_Te],
    '(30 - 23) * 10k = 70,000' AS [Cong_Thuc_Mong_Doi]
FROM NhanVien
WHERE CCCD = '888888888';
GO





-- TEST HÀM 2: TÍNH CƯỚC PHÍ
-- Test Case DON01:
-- Trọng lượng: 1200kg. Cước: 1200 * 5000 = 6.000.000
-- Phụ phí hàng: 0 (Quần áo)
-- Bảo hiểm: +15.000
-- Hỏa tốc: Không
-- -> TỔNG: 6.015.000
SELECT 
    'HAM 2: Tinh cuoc DON01 (Co Bao Hiem)' AS [Ten_Test],
    Ma_don, 
    FORMAT(dbo.f_TinhCuocPhiDonHang(Ma_don), 'N0') + ' VND' AS [Cuoc_Phi_Tinh_Ra]
FROM Don_van_chuyen
WHERE Ma_don = 'DON01';

-- Test Case DON02:
-- Trọng lượng: 1000kg. Cước: 1000 * 5000 = 5.000.000
-- Phụ phí hàng: +50.000 (Đồ điện tử)
-- Bảo hiểm: 0
-- Tổng tạm: 5.050.000
-- Hỏa tốc: x2
-- -> TỔNG: 10.100.000
SELECT 
    'HAM 2: Tinh cuoc DON02 (Hoa Toc, Dien Tu)' AS [Ten_Test],
    Ma_don, 
    FORMAT(dbo.f_TinhCuocPhiDonHang(Ma_don), 'N0') + ' VND' AS [Cuoc_Phi_Tinh_Ra]
FROM Don_van_chuyen
WHERE Ma_don = 'DON02';
GO