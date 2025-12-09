-- PART 1: TẠO DATABASE VÀ CÁC BẢNG (DDL)

USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'BKExpress')
BEGIN
    ALTER DATABASE BKExpress SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE BKExpress;
END
GO

CREATE DATABASE BKExpress;
GO

USE BKExpress;
GO

-- TẠO CÁC SEQUENCE ĐỂ SINH MÃ TỰ ĐỘNG (Thay thế cho bảng Sequence và Trigger cũ)
CREATE SEQUENCE Seq_KhachHang START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE Seq_Kho START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE Seq_NhanVien START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE Seq_Don START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE Seq_ChuyenHang START WITH 1 INCREMENT BY 1;
GO

-- NHÓM 1: CÁC BẢNG CƠ BẢN 
-- 1. Bảng Role
CREATE TABLE Role (
    ma_role INT IDENTITY(1,1) PRIMARY KEY,
    quyen_truy_cap NVARCHAR(50) NOT NULL,
    CONSTRAINT CHK_Role CHECK (quyen_truy_cap IN ('KhachHang', 'TaiXe', 'NhanVienKho', 'CSKH', 'QuanLy'))
); 

-- 2. Bảng TaiKhoan
CREATE TABLE TaiKhoan (
    ma_TK INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 3. Bảng Taikhoan_Co_Role 
CREATE TABLE Taikhoan_Co_Role (
    ma_TK INT,
    ma_role INT,
    PRIMARY KEY (ma_TK, ma_role),
    CONSTRAINT FK_TKRole_TK FOREIGN KEY (ma_TK) REFERENCES TaiKhoan(ma_TK),
    CONSTRAINT FK_TKRole_Role FOREIGN KEY (ma_role) REFERENCES Role(ma_role)
);

-- 4. Bảng Kho
CREATE TABLE Kho (
    ma_kho VARCHAR(10) PRIMARY KEY DEFAULT ('KHO' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_Kho AS VARCHAR(10)), 4)),
    ten_kho NVARCHAR(100),
    dia_chi NVARCHAR(255),
    gio_mo_cua TIME DEFAULT '08:00',
    gio_dong_cua TIME,
    CONSTRAINT CHK_GioHoatDong CHECK (gio_dong_cua > gio_mo_cua)
);

-- 5. Bảng Phuong_tien_van_chuyen
CREATE TABLE Phuong_tien_van_chuyen (
    bien_so_xe VARCHAR(15) PRIMARY KEY,
    trang_thai NVARCHAR(50) DEFAULT 'SanSang',
    tai_trong_tan INT,
    loai_xe NVARCHAR(255),
    vi_tri_do NVARCHAR(255),
    CONSTRAINT CHK_TrangThaiXe CHECK (trang_thai IN ('SanSang','DangVanChuyen'))
);

-- 6. Bảng Don_van_chuyen
CREATE TABLE Don_van_chuyen (
    Ma_don VARCHAR(20) PRIMARY KEY DEFAULT ('DON' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_Don AS VARCHAR(10)), 4)),
    loai_phuong_tien NVARCHAR(50),
    bao_hiem BIT DEFAULT 0, -- 0: False, 1: True
    tuy_chon_giao_hang NVARCHAR(50),
    ma_uu_dai VARCHAR(20),
    hinh_thuc_thanh_toan NVARCHAR(50),
    dia_chi_nguoi_gui NVARCHAR(255) NOT NULL,
    ten_nguoi_gui NVARCHAR(100) NOT NULL,
    sdt_nguoi_gui VARCHAR(15) NOT NULL,
    dia_chi_nguoi_nhan NVARCHAR(255) NOT NULL,
    ten_nguoi_nhan NVARCHAR(100) NOT NULL,
    sdt_nguoi_nhan VARCHAR(15) NOT NULL
);

-- 7. Bảng Chuyen_hang
CREATE TABLE Chuyen_hang (
    Ma_chuyen_hang VARCHAR(20) PRIMARY KEY DEFAULT ('CH' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_ChuyenHang AS VARCHAR(10)), 4)),
    Dia_chi_giao NVARCHAR(255) NOT NULL,
    Dia_chi_nhan_hang NVARCHAR(255) NOT NULL
);

-- 8. Bảng Ho_tro
CREATE TABLE Ho_tro (
    Ma_ho_tro INT IDENTITY(1,1) PRIMARY KEY,
    trang_thai NVARCHAR(50) DEFAULT 'DangXuLy',
    muc_do_uu_tien NVARCHAR(20),
    van_de NVARCHAR(MAX)
);

-- NHÓM 2: CÁC BẢNG CẤP 1 

-- 10. Bảng NhanVien 
CREATE TABLE NhanVien (
    Ma_NV VARCHAR(20) UNIQUE DEFAULT ('NV' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_NhanVien AS VARCHAR(10)), 4)),
    CCCD VARCHAR(12) PRIMARY KEY,
    ho_ten NVARCHAR(100) NOT NULL,
    dia_chi NVARCHAR(255),
    sdt VARCHAR(15) UNIQUE NOT NULL,
    STK VARCHAR(20) NOT NULL,
    gioi_tinh NVARCHAR(10) DEFAULT 'Nam',
    nam_sinh INT,
    ma_TK INT UNIQUE,
    luong_co_ban DECIMAL(15,0),
    chuc_vu NVARCHAR(50),
    so_ngay_lam_viec INT DEFAULT 0,
    luong DECIMAL(15,0) DEFAULT 0,
    CONSTRAINT FK_NV_TaiKhoan FOREIGN KEY (ma_TK) REFERENCES TaiKhoan(ma_TK),
    -- Ràng buộc tuổi (Logic trigger cũ chuyển thành Check Constraint nếu có thể, hoặc Trigger)
    CONSTRAINT CHK_ChucVu CHECK (chuc_vu IN ('NhanVienKho', 'QuanLyKho', 'TaiXeLienTinh', 'QuanLyTaiXeLienTinh', 'TaiXeNoiThanh', 'NhanVienCSKH', 'QuanLyTaiXeNoiThanh'))
);

-- Trigger kiểm tra tuổi > 18 (Thay thế cho BEFORE INSERT trigger)
GO
CREATE TRIGGER tg_KiemTraTuoi_NV
ON NhanVien
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE nam_sinh > YEAR(GETDATE()) - 18)
    BEGIN
        RAISERROR (N'Thông báo: Nhân viên chưa đủ 18 tuổi. Vui lòng kiểm tra lại năm sinh.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- 11. Bảng KhachHang
CREATE TABLE KhachHang (
    ID_khachhang VARCHAR(10) PRIMARY KEY DEFAULT ('KH' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_KhachHang AS VARCHAR(10)), 4)),
    ten NVARCHAR(100),
    sdt VARCHAR(15) NOT NULL UNIQUE,
    ma_TK INT UNIQUE,
    CONSTRAINT FK_KH_TaiKhoan FOREIGN KEY (ma_TK) REFERENCES TaiKhoan(ma_TK)
);

-- 12. Bảng Dat (Quan hệ KhachHang - DonHang)
CREATE TABLE Dat (
    Ma_don VARCHAR(20) PRIMARY KEY,
    ID_khachhang VARCHAR(10),
    CONSTRAINT FK_Dat_Don FOREIGN KEY (Ma_don) REFERENCES Don_van_chuyen(Ma_don),
    CONSTRAINT FK_Dat_KH FOREIGN KEY (ID_khachhang) REFERENCES KhachHang(ID_khachhang)
);

-- 13. Bảng KH_Yeucau_Hotro
CREATE TABLE KH_Yeucau_Hotro (
    ID_khachhang VARCHAR(10),
    Ma_ho_tro INT PRIMARY KEY,
    CONSTRAINT FK_YeuCau_KH FOREIGN KEY (ID_khachhang) REFERENCES KhachHang(ID_khachhang),
    CONSTRAINT FK_YeuCau_HT FOREIGN KEY (Ma_ho_tro) REFERENCES Ho_tro(Ma_ho_tro)
);

-- 14. Bảng Hanh_trinh_don_van_chuyen
CREATE TABLE Hanh_trinh_don_van_chuyen (
    ma_don VARCHAR(20),
    hanh_trinh_don INT,
    thoi_gian DATETIME DEFAULT GETDATE(),
    dia_diem NVARCHAR(255),
    tinh_trang NVARCHAR(50),
    PRIMARY KEY (ma_don, hanh_trinh_don),
    CONSTRAINT FK_HT_Don FOREIGN KEY (ma_don) REFERENCES Don_van_chuyen(Ma_don)
);

-- 15. Bảng Hang_hoa 
CREATE TABLE Hang_hoa (
    STT INT,
    Ma_don VARCHAR(20),
    so_luong INT CHECK (so_luong > 0),
    loai_hang NVARCHAR(50),
    khoi_luong NVARCHAR(50),
    kich_thuoc NVARCHAR(50),
    PRIMARY KEY (STT, Ma_don),
    CONSTRAINT FK_HangHoa_Don FOREIGN KEY (Ma_don) REFERENCES Don_van_chuyen(Ma_don)
);

-- 16. Bảng Chua (Quan hệ Chuyen_hang chứa Hang_hoa)
CREATE TABLE Chua (
    STT INT,
    Ma_chuyen_hang VARCHAR(20),
    Ma_don VARCHAR(20),
    PRIMARY KEY (Ma_chuyen_hang, Ma_don, STT),
    CONSTRAINT FK_Chua_Chuyen FOREIGN KEY (Ma_chuyen_hang) REFERENCES Chuyen_hang(Ma_chuyen_hang),
    CONSTRAINT FK_Chua_Hang FOREIGN KEY (STT, Ma_don) REFERENCES Hang_hoa(STT, Ma_don)
);

-- 17. Bảng Kho_Chua_Hang_hoa 
CREATE TABLE Kho_Chua_Hang_hoa (
    STT INT,
    Ma_kho VARCHAR(10),
    Ma_don VARCHAR(20),
    PRIMARY KEY (Ma_kho, STT, Ma_don),
    CONSTRAINT FK_KCHH_Kho FOREIGN KEY (Ma_kho) REFERENCES Kho(ma_kho),
    CONSTRAINT FK_KCHH_Hang FOREIGN KEY (STT, Ma_don) REFERENCES Hang_hoa(STT, Ma_don)
);

-- 18. Bảng Phuongtien_Vanchuyen_Chuyenhang 
CREATE TABLE Phuongtien_Vanchuyen_Chuyenhang (
    Ma_chuyen_hang VARCHAR(20) PRIMARY KEY,
    Bien_so_xe VARCHAR(15),
    CONSTRAINT FK_PVCC_Chuyen FOREIGN KEY (Ma_chuyen_hang) REFERENCES Chuyen_hang(Ma_chuyen_hang),
    CONSTRAINT FK_PVCC_Xe FOREIGN KEY (Bien_so_xe) REFERENCES Phuong_tien_van_chuyen(bien_so_xe)
);

-- NHÓM 3: CÁC SUBCLASS CỦA NHÂN VIÊN

-- 19. Bảng Nhan_vien_CSKH
CREATE TABLE Nhan_vien_CSKH (
    CCCD VARCHAR(12) PRIMARY KEY,
    CONSTRAINT FK_CSKH_NV FOREIGN KEY (CCCD) REFERENCES NhanVien(CCCD)
);

-- 20. Bảng CSKH_Ho_tro
CREATE TABLE CSKH_Ho_tro (
    CCCD VARCHAR(12),
    Ma_ho_tro INT PRIMARY KEY,
    CONSTRAINT FK_CSKH_HT_NV FOREIGN KEY (CCCD) REFERENCES Nhan_vien_CSKH(CCCD),
    CONSTRAINT FK_CSKH_HT_HT FOREIGN KEY (Ma_ho_tro) REFERENCES Ho_tro(Ma_ho_tro)
);

-- 21. Bảng Nhan_vien_kho
CREATE TABLE Nhan_vien_kho (
    CCCD VARCHAR(12) PRIMARY KEY,
    ca_lam NVARCHAR(20) DEFAULT 'Sang',
    ngay_bat_dau_lam DATE,
    CONSTRAINT FK_NVKho_NV FOREIGN KEY (CCCD) REFERENCES NhanVien(CCCD),
    CONSTRAINT CHK_CaLam CHECK (ca_lam IN ('Sang', 'Chieu', 'Toi'))
);

-- 22. Bảng Nhanvienkho_Quanli_Kho (Quản Lý Kho)
CREATE TABLE Nhanvienkho_Quanli_Kho (
    CCCD VARCHAR(12) PRIMARY KEY,
    ma_kho VARCHAR(10),
    CONSTRAINT FK_QLKho_NV FOREIGN KEY (CCCD) REFERENCES NhanVien(CCCD),
    CONSTRAINT FK_QLKho_Kho FOREIGN KEY (ma_kho) REFERENCES Kho(ma_kho)
);

-- 23. Bảng Giam_sat
CREATE TABLE Giam_sat (
    CCCD_quanly VARCHAR(12),
    CCCD_nhanvien VARCHAR(12) PRIMARY KEY,
    CONSTRAINT FK_GS_QL FOREIGN KEY (CCCD_quanly) REFERENCES Nhanvienkho_Quanli_Kho(CCCD),
    CONSTRAINT FK_GS_NV FOREIGN KEY (CCCD_nhanvien) REFERENCES Nhan_vien_kho(CCCD)
);

-- 24. Bảng Kho_Co_Nhanvienkho 
CREATE TABLE Kho_Co_Nhanvienkho (
    CCCD VARCHAR(12),
    Ma_kho VARCHAR(10),
    PRIMARY KEY (CCCD, Ma_kho),
    CONSTRAINT FK_KCNK_NV FOREIGN KEY (CCCD) REFERENCES Nhan_vien_kho(CCCD),
    CONSTRAINT FK_KCNK_Kho FOREIGN KEY (Ma_kho) REFERENCES Kho(ma_kho)
);

-- 25. Bảng Xuat_nhap
CREATE TABLE Xuat_nhap (
    cccd VARCHAR(12),
    STT INT,
    Ma_don VARCHAR(20),
    PRIMARY KEY (STT, Ma_don), -- Logic này hơi lạ vì 1 hàng hóa chỉ xuất nhập 1 lần?
    CONSTRAINT FK_XN_NV FOREIGN KEY (cccd) REFERENCES Nhan_vien_kho(CCCD),
    CONSTRAINT FK_XN_Hang FOREIGN KEY (STT, Ma_don) REFERENCES Hang_hoa(STT, Ma_don)
);

-- 26. Bảng Giao_Nhan
CREATE TABLE Giao_Nhan (
    Ma_chuyen_hang VARCHAR(20) PRIMARY KEY,
    CCCD VARCHAR(12),
    CONSTRAINT FK_GN_Chuyen FOREIGN KEY (Ma_chuyen_hang) REFERENCES Chuyen_hang(Ma_chuyen_hang),
    CONSTRAINT FK_GN_NV FOREIGN KEY (CCCD) REFERENCES Nhan_vien_kho(CCCD)
);

-- 27. Bảng TaiXe
CREATE TABLE TaiXe (
    CCCD VARCHAR(12) PRIMARY KEY,
    bang_lai_xe VARCHAR(20) NOT NULL,
    CONSTRAINT FK_TaiXe_NV FOREIGN KEY (CCCD) REFERENCES NhanVien(CCCD)
);

-- 28. Bảng Tai_xe_noi_thanh
CREATE TABLE Tai_xe_noi_thanh (
    CCCD VARCHAR(12) PRIMARY KEY,
    khu_vuc_hoat_dong NVARCHAR(100),
    bien_so_xe VARCHAR(15),
    CONSTRAINT FK_TXNT_TaiXe FOREIGN KEY (CCCD) REFERENCES TaiXe(CCCD),
    CONSTRAINT FK_TXNT_Xe FOREIGN KEY (bien_so_xe) REFERENCES Phuong_tien_van_chuyen(bien_so_xe)
);

-- 29. Bảng Tai_xe_lien_tinh
CREATE TABLE Tai_xe_lien_tinh (
    CCCD VARCHAR(12) PRIMARY KEY,
    trang_thai NVARCHAR(50) DEFAULT 'SanSang',
    ma_kho_lam_viec VARCHAR(10),
    CONSTRAINT FK_TXLT_TaiXe FOREIGN KEY (CCCD) REFERENCES TaiXe(CCCD),
    CONSTRAINT FK_TXLT_Kho FOREIGN KEY (ma_kho_lam_viec) REFERENCES Kho(ma_kho),
    CONSTRAINT CHK_TrangThaiTaiXe CHECK (trang_thai IN ('SanSang', 'DangVanChuyen', 'NghiPhep'))
);

-- 30. Bảng Tai_xe_NT_Van_chuyen_Hang_hoa
CREATE TABLE Tai_xe_NT_Van_chuyen_Hang_hoa (
    STT INT, -- Hang_hoa STT
    Ma_don VARCHAR(20),
    CCCD VARCHAR(12),
    PRIMARY KEY (STT, Ma_don, CCCD),
    CONSTRAINT FK_TXNTHH_Hang FOREIGN KEY (STT, Ma_don) REFERENCES Hang_hoa(STT, Ma_don),
    CONSTRAINT FK_TXNTHH_TX FOREIGN KEY (CCCD) REFERENCES Tai_xe_noi_thanh(CCCD)
);

-- 31. Bảng Quan_ly_tai_xe
CREATE TABLE Quan_ly_tai_xe (
    CCCD VARCHAR(12) PRIMARY KEY,
    CONSTRAINT FK_QLTX_NV FOREIGN KEY (CCCD) REFERENCES NhanVien(CCCD)
);

-- 32. Bảng Quan_ly_noi_thanh
CREATE TABLE Quan_ly_noi_thanh (
    cccd VARCHAR(12) PRIMARY KEY,
    khu_vuc_quan_ly NVARCHAR(100),
    CONSTRAINT FK_QLNT_QLTX FOREIGN KEY (cccd) REFERENCES Quan_ly_tai_xe(CCCD)
);

-- 33. Bảng Quan_ly_lien_tinh
CREATE TABLE Quan_ly_lien_tinh (
    CCCD VARCHAR(12) PRIMARY KEY,
    CONSTRAINT FK_QLLT_QLTX FOREIGN KEY (CCCD) REFERENCES Quan_ly_tai_xe(CCCD)
);

-- 34. Bảng Quanli_TaixeNT
CREATE TABLE Quanli_TaixeNT (
    CCCD_Taixe VARCHAR(12) PRIMARY KEY,
    CCCD_Quanli VARCHAR(12),
    CONSTRAINT FK_QLTXNT_TX FOREIGN KEY (CCCD_Taixe) REFERENCES Tai_xe_noi_thanh(CCCD),
    CONSTRAINT FK_QLTXNT_QL FOREIGN KEY (CCCD_Quanli) REFERENCES Quan_ly_noi_thanh(cccd)
);

-- 35. Bảng Quanli_TaixeLT
CREATE TABLE Quanli_TaixeLT (
    CCCD_Taixe VARCHAR(12) PRIMARY KEY,
    CCCD_Quanli VARCHAR(12),
    CONSTRAINT FK_QLTXLT_TX FOREIGN KEY (CCCD_Taixe) REFERENCES Tai_xe_lien_tinh(CCCD),
    CONSTRAINT FK_QLTXLT_QL FOREIGN KEY (CCCD_Quanli) REFERENCES Quan_ly_lien_tinh(CCCD)
);

-- 36. Bảng Quanli_Phuongtienvan_chuyen
CREATE TABLE Quanli_Phuongtienvan_chuyen (
    Bien_so_xe VARCHAR(15) PRIMARY KEY,
    CCCD VARCHAR(12),
    CONSTRAINT FK_QLPT_Xe FOREIGN KEY (Bien_so_xe) REFERENCES Phuong_tien_van_chuyen(bien_so_xe),
    CONSTRAINT FK_QLPT_QL FOREIGN KEY (CCCD) REFERENCES Quan_ly_lien_tinh(CCCD)
);

-- 37. TaixeLT_Vanchuyen_Chuyenhang
CREATE TABLE TaixeLT_Vanchuyen_Chuyenhang (
    Ma_chuyen_hang VARCHAR(20) PRIMARY KEY,
    CCCD VARCHAR(12),
    CONSTRAINT FK_TXLT_VC_Chuyen FOREIGN KEY (Ma_chuyen_hang) REFERENCES Chuyen_hang(Ma_chuyen_hang),
    CONSTRAINT FK_TXLT_VC_TX FOREIGN KEY (CCCD) REFERENCES Tai_xe_lien_tinh(CCCD)
);
GO

-- PART 2: INSERT DATA 

-- NHÓM 1: CÁC BẢNG CƠ BẢN 
-- 1. Bảng Role
INSERT INTO Role (quyen_truy_cap) VALUES ('KhachHang'), ('TaiXe'), ('NhanVienKho'), ('CSKH'), ('QuanLy');

-- 2. Bảng TaiKhoan 
INSERT INTO TaiKhoan (username, password) VALUES
('khach1', '123'), ('khach2', '123'), ('khach3', '123'), ('khach4', '123'), ('khach5', '123'),
('taixe1', '123'), ('taixe2', '123'), ('taixe3', '123'), ('taixe4', '123'), ('taixe5', '123'),
('kho1', '123'), ('kho2', '123'), ('kho3', '123'), ('kho4', '123'),
('cskh1', '123'), ('cskh2', '123'), ('cskh3', '123'),
('admin1', '123'), ('admin2', '123'), ('admin3', '123'),
('taixe_nt_new1', '123'), ('taixe_nt_new2', '123'), ('taixe_nt_new3', '123'),
('taixe_lt_new1', '123'), ('taixe_lt_new2', '123'), ('taixe_lt_new3', '123'),
('kho_new1', '123'), ('kho_new2', '123'), ('kho_new3', '123'),
('ql_kho_new1', '123'), ('ql_kho_new2', '123'), ('ql_kho_new3', '123'),
('cskh_new1', '123'), ('cskh_new2', '123'),
('ql_nt_new1', '123'), ('ql_nt_new2', '123'), ('ql_nt_new3', '123'),
('ql_lt_new1', '123'), ('ql_lt_new2', '123'), ('ql_lt_new3', '123'), ('ql_lt_new4', '123');

-- 3. Bảng Taikhoan_Co_Role
INSERT INTO Taikhoan_Co_Role (ma_TK, ma_role) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1); 

-- 4. Bảng Kho (Cung cấp giá trị mặc định cho cột ma_kho bằng SEQUENCE nên ta không cần insert vào cột này nếu muốn tự động, nhưng ở đây insert thủ công thì phải khớp)
-- Vì SQL Server khó vừa tự động vừa nhập tay cho 1 cột cùng lúc đơn giản như MySQL, ta sẽ INSERT đầy đủ.
INSERT INTO Kho (ma_kho, ten_kho, dia_chi, gio_mo_cua, gio_dong_cua) VALUES 
('KHO_HN', N'Kho Ha Noi', N'123 Cau Giay', '08:00', '22:00'), 
('KHO_HCM', N'Kho HCM', N'456 Thu Duc', '08:00', '22:00'), 
('KHO_DN', N'Kho Da Nang', N'789 Hai Chau', '08:00', '21:00'), 
('KHO_AG', N'Kho An Giang', N'363 My Tho', '08:00', '21:00'), 
('KHO_CT', N'Kho Can Tho', N'101 Ninh Kieu', '08:00', '21:00');

-- 5. Bảng Phuong_tien_van_chuyen
INSERT INTO Phuong_tien_van_chuyen VALUES 
('29A-11111', 'SanSang', 3, 'tai', N'Bai Xe HN'), 
('29A-22222', 'SanSang', 4, 'tai', N'Bai Xe HN'), 
('51C-33333', 'DangVanChuyen', 7, 'tai', N'Quan 1, HCM'), 
('43A-44444', 'DangVanChuyen', 2, 'tai', N'Garage DN'), 
('65C-55555', 'SanSang', 5, 'tai', N'Bai Xe CT');

-- 6. Bảng Don_van_chuyen 
INSERT INTO Don_van_chuyen (Ma_don, loai_phuong_tien, hinh_thuc_thanh_toan, ten_nguoi_gui, dia_chi_nguoi_gui, tuy_chon_giao_hang, ma_uu_dai, sdt_nguoi_gui, sdt_nguoi_nhan, dia_chi_nguoi_nhan, ten_nguoi_nhan) VALUES
('DON01', 'XeMay', 'TienMat', N'Nguyen Van A', N'Ha Noi', 'khong co', 'khong co', '0913726856', '0984756352', N'Quan 1, HCM', N'Trinh Tran Trung Tinh'),
('DON02', 'XeTai', 'ChuyenKhoan', N'Tran Thi B', N'HCM', 'khong co', 'khong co', '0913458856', '0984751922', N'Quan 6, HCM', N'Trinh Tran Tuan'),
('DON03', 'XeMay', 'COD', N'Le Van C', N'Da Nang', 'khong co', 'AAMCN', '0913379856', '0981928922', N'My Tho, CT', N'Phan Dang Tuan'),
('DON04', 'XeTai', 'TienMat', N'Pham Thi D', N'Can Tho', 'khong co', 'MKSOD', '0913459746', '0984751994', N'My Thoi, AG', N'Tran Van Tuan'),
('DON05', 'XeMay', 'ChuyenKhoan', N'Hoang Van E', N'Hai Phong', 'khong co', 'khong co', '0911458856', '0873751922', N'My Tho, AG', N'Trinh Van Tuan');

-- 7. Bảng Chuyen_hang
INSERT INTO Chuyen_hang VALUES 
('CH01', N'Kho HN', N'Kho HCM'), 
('CH02', N'Kho HCM', N'Kho HN'), 
('CH03', N'Kho DN', N'Kho Hue'), 
('CH04', N'Kho CT', N'Kho HCM'), 
('CH05', N'Kho AG', N'Kho AG');

-- 8. Bảng Ho_tro
INSERT INTO Ho_tro (trang_thai, muc_do_uu_tien, van_de) VALUES 
('DangXuLy', 'Cao', N'Mat hang'), 
('DaXong', 'Thap', N'Gia cuoc'), 
('DangXuLy', 'TB', N'Thai do'), 
('DaXong', 'Thap', N'Hang de vo'), 
('DaXong', 'Cao', N'Hang bi vo');

-- 10. Bảng NhanVien 
INSERT INTO NhanVien (CCCD, ho_ten, sdt, chuc_vu, nam_sinh, gioi_tinh, luong_co_ban, so_ngay_lam_viec, dia_chi, STK, ma_TK) VALUES
('01928471', N'TaiXeNoiThanh', '0901', 'TaiXeNoiThanh', 1995, 'Nam', 5000000, 365, N'Quan 5', '01827487', 6),
('01928472', N'TaiXeLienTinh', '0902', 'TaiXeLienTinh', 1996, 'Nam', 5000000, 364, N'Quan 3', '01444487', 7),
('01928473', N'TaiXeNoiThanh', '0903', 'TaiXeNoiThanh', 1997, 'Nu', 5000000, 365, N'Quan 1', '01142487', 8),
('01928474', N'TaiXeLienTinh', '0904', 'TaiXeLienTinh', 1990, 'Nam', 5000000, 363, N'My Tho', '01819487', 9),
('01928475', N'NhanVienKho', '0905', 'NhanVienKho', 2000, 'Nu', 3000000, 362, N'Quan 8', '01813287', 10),
('01928476', N'NhanVienKho', '0906', 'NhanVienKho', 1999, 'Nam', 3000000, 360, N'Quan 9', '01845877', 11),
('01928477', N'QuanLyKho', '0907', 'QuanLyKho', 1985, 'Nam', 1000000000, 365, N'Quan 9', '01811187', 12),
('01928478', N'QuanLyKho', '0908', 'QuanLyKho', 1988, 'Nu', 1000000000, 364, N'Quan 10', '01811087', 13),
('01928479', N'NhanVienCSKH', '0909', 'NhanVienCSKH', 2001, 'Nu', 5000000, 362, N'Quan 11', '01227487', 14),
('01928470', N'NhanVienCSKH', '0910', 'NhanVienCSKH', 2002, 'Nu', 5000000, 363, N'Quan 12', '01827407', 15),
('01928481', N'NhanVienCSKH', '0911', 'NhanVienCSKH', 2003, 'Nu', 5000000, 361, N'Quan 13', '01141487', 16),
('01928482', N'QuanLyNoiThanh', '0912', 'QuanLyTaiXeNoiThanh', 1980, 'Nam', 5000000000, 364, N'Quan 5', '01829987', 17),
('01928483', N'QuanLyNoiThanh', '0913', 'QuanLyTaiXeNoiThanh', 1982, 'Nam', 5000000000, 361, N'Quan 7', '01812187', 18),
('01928484', N'QuanLyLienTinh', '0914', 'QuanLyTaiXeLienTinh', 1983, 'Nam', 5000000000, 360, N'Quan 6', '01827997', 19),
('01928485', N'TaiXeNoiThanh', '0915', 'TaiXeNoiThanh', 1995, 'Nam', 5000000, 300, N'HN', '1111', 21),
('01928486', N'TaiXeNoiThanh', '0916', 'TaiXeNoiThanh', 1996, 'Nam', 5000000, 300, N'HN', '1112', 22),
('01928487', N'TaiXeNoiThanh', '0917', 'TaiXeNoiThanh', 1997, 'Nam', 5000000, 300, N'HN', '1113', 23),
('01928488', N'TaiXeLienTinh', '0918', 'TaiXeLienTinh', 1990, 'Nam', 6000000, 300, N'HCM', '1114', 24),
('01928489', N'TaiXeLienTinh', '0919', 'TaiXeLienTinh', 1991, 'Nam', 6000000, 300, N'HCM', '1115', 25),
('01928490', N'TaiXeLienTinh', '0920', 'TaiXeLienTinh', 1992, 'Nam', 6000000, 300, N'HCM', '1116', 26),
('01928491', N'NhanVienKho', '0921', 'NhanVienKho', 2000, 'Nu', 3000000, 200, N'DN', '1117', 27),
('01928492', N'NhanVienKho', '0922', 'NhanVienKho', 2001, 'Nu', 3000000, 200, N'DN', '1118', 28),
('01928493', N'NhanVienKho', '0923', 'NhanVienKho', 2002, 'Nu', 3000000, 200, N'DN', '1119', 29),
('01928494', N'QuanLyKho', '0924', 'QuanLyKho', 1985, 'Nam', 10000000, 365, N'AG', '1120', 30),
('01928495', N'QuanLyKho', '0925', 'QuanLyKho', 1986, 'Nam', 10000000, 365, N'AG', '1121', 31),
('01928496', N'QuanLyKho', '0926', 'QuanLyKho', 1987, 'Nam', 10000000, 365, N'AG', '1122', 32),
('01928497', N'NhanVienCSKH', '0927', 'NhanVienCSKH', 2003, 'Nu', 5000000, 300, N'CT', '1123', 33),
('01928498', N'NhanVienCSKH', '0928', 'NhanVienCSKH', 2003, 'Nu', 5000000, 300, N'CT', '1124', 34),
('01928499', N'QuanLyNoiThanh', '0929', 'QuanLyTaiXeNoiThanh', 1980, 'Nam', 8000000, 365, N'HN', '1125', 35),
('01928500', N'QuanLyNoiThanh', '0930', 'QuanLyTaiXeNoiThanh', 1981, 'Nam', 8000000, 365, N'HN', '1126', 36),
('01928501', N'QuanLyNoiThanh', '0931', 'QuanLyTaiXeNoiThanh', 1982, 'Nam', 8000000, 365, N'HN', '1127', 37),
('01928502', N'QuanLyLienTinh', '0932', 'QuanLyTaiXeLienTinh', 1983, 'Nam', 9000000, 365, N'HCM', '1128', 38),
('01928503', N'QuanLyLienTinh', '0933', 'QuanLyTaiXeLienTinh', 1984, 'Nam', 9000000, 365, N'HCM', '1129', 39),
('01928504', N'QuanLyLienTinh', '0934', 'QuanLyTaiXeLienTinh', 1985, 'Nam', 9000000, 365, N'HCM', '1130', 40),
('01928505', N'QuanLyLienTinh', '0935', 'QuanLyTaiXeLienTinh', 1986, 'Nam', 9000000, 365, N'HCM', '1131', 20);

-- 11. Bảng KhachHang (Lưu ý: Insert không có cột ID, trigger sẽ tự điền ID mới)
INSERT INTO KhachHang (ten, sdt, ma_TK) VALUES
(N'Khach Hang A', '0981', 1), 
(N'Khach Hang B', '0982', 2), 
(N'Khach Hang C', '0983', 3), 
(N'Khach Hang D', '0984', 4), 
(N'Khach Hang E', '0985', 5);

-- 12. Bảng Dat
INSERT INTO Dat (Ma_don, ID_khachhang) VALUES 
('DON01', 'KH0001'), ('DON02', 'KH0002'), ('DON03', 'KH0003'), ('DON04', 'KH0004'), ('DON05', 'KH0005');

-- 13. Bảng KH_Yeucau_Hotro
INSERT INTO KH_Yeucau_Hotro (ID_khachhang, Ma_ho_tro) VALUES 
('KH0001', 1), ('KH0002', 2), ('KH0003', 3), ('KH0001', 4), ('KH0002', 5);

-- 14. Bảng Hanh_trinh_don_van_chuyen
INSERT INTO Hanh_trinh_don_van_chuyen (ma_don, hanh_trinh_don, dia_diem, tinh_trang) VALUES 
('DON01', 1, N'Kho HN', 'DaLayHang'), 
('DON01', 2, N'Kho Trung Chuyen', 'DangVanChuyen'), 
('DON02', 1, N'Kho HCM', 'DaLayHang'), 
('DON03', 1, N'Kho DN', 'GiaoThanhCong'), 
('DON03', 2, N'Kho AG', 'ChuaLayHang');

-- 15. Bảng Hang_hoa
INSERT INTO Hang_hoa (STT, Ma_don, loai_hang, so_luong, khoi_luong, kich_thuoc) VALUES 
(1, 'DON01', N'Quan Ao', 2, '6 ta', '50 m3'), 
(1, 'DON02', N'Do Dien Tu', 1, '10 ta', '50 m3'), 
(1, 'DON03', N'Giay Dep', 1, '3 ta', '30 m3'), 
(1, 'DON04', N'Sach Vo', 10, '5 ta', '20 m3'), 
(1, 'DON05', N'Thuc Pham', 5, '9 ta', '36 m3');

-- 16. Bảng Chua
INSERT INTO Chua (STT, Ma_chuyen_hang, Ma_don) VALUES (1, 'CH01', 'DON01'), (1, 'CH01', 'DON02'), (1, 'CH02', 'DON03'), (1, 'CH03', 'DON04'), (1, 'CH03', 'DON05');

-- 17. Bảng Kho_Chua_Hang_hoa
INSERT INTO Kho_Chua_Hang_hoa (STT, Ma_kho, Ma_don) VALUES (1, 'KHO_HN', 'DON01'), (1, 'KHO_HCM', 'DON02'), (1, 'KHO_DN', 'DON03'), (1, 'KHO_CT', 'DON04'), (1, 'KHO_AG', 'DON05');

-- 18. Bảng Phuongtien_Vanchuyen_Chuyenhang
INSERT INTO Phuongtien_Vanchuyen_Chuyenhang (Ma_chuyen_hang, Bien_so_xe) VALUES ('CH01', '29A-11111'), ('CH02', '51C-33333'), ('CH03', '29A-22222'), ('CH04', '65C-55555'), ('CH05', '43A-44444');

-- 19. Bảng Nhan_vien_CSKH 
INSERT INTO Nhan_vien_CSKH (CCCD) VALUES ('01928479'), ('01928470'), ('01928481'), ('01928497'), ('01928498');

-- 20. Bảng CSKH_Ho_tro
INSERT INTO CSKH_Ho_tro (CCCD, Ma_ho_tro) VALUES ('01928479', 1), ('01928479', 2), ('01928470', 3), ('01928481', 4), ('01928497', 5);

-- 21. Bảng Nhan_vien_kho (Fix định dạng ngày)
INSERT INTO Nhan_vien_kho (CCCD, ca_lam, ngay_bat_dau_lam) VALUES 
('01928475', 'Sang', '2020-12-26'), 
('01928476', 'Chieu', '2021-10-14'),
('01928491', 'Sang', '2022-01-01'), 
('01928492', 'Chieu', '2022-01-01'), 
('01928493', 'Toi', '2022-01-01');

-- 22. Bảng Nhanvienkho_Quanli_Kho
INSERT INTO Nhanvienkho_Quanli_Kho (CCCD, ma_kho) VALUES 
('01928477', 'KHO_HN'), ('01928478', 'KHO_HCM'),
('01928494', 'KHO_DN'), ('01928495', 'KHO_AG'), ('01928496', 'KHO_CT');

-- 23. Bảng Giam_sat
INSERT INTO Giam_sat (CCCD_quanly, CCCD_nhanvien) VALUES 
('01928477', '01928475'),
('01928477', '01928476'), 
('01928494', '01928491'), 
('01928494', '01928492'), 
('01928494', '01928493'); 

-- 24. Bảng Kho_Co_Nhanvienkho
INSERT INTO Kho_Co_Nhanvienkho (CCCD, Ma_kho) VALUES 
('01928475', 'KHO_HN'), 
('01928476', 'KHO_HN'),
('01928491', 'KHO_DN'), 
('01928492', 'KHO_DN'), 
('01928493', 'KHO_DN'); 
-- 25. Bảng Xuat_nhap (Fix dữ liệu Don05 -> DON05)
INSERT INTO Xuat_nhap (cccd, Ma_don, STT) VALUES ('01928475', 'DON01', 1), ('01928476', 'DON02', 1), ('01928475', 'DON03', 1), ('01928476', 'DON04', 1), ('01928475', 'DON05', 1);

-- 26. Bảng Giao_Nhan
INSERT INTO Giao_Nhan (Ma_chuyen_hang, CCCD) VALUES ('CH01', '01928475'), ('CH02', '01928476'), ('CH03', '01928475'), ('CH04', '01928476'), ('CH05', '01928476');

-- 27. Bảng TaiXe 
INSERT INTO TaiXe (CCCD, bang_lai_xe) VALUES
('01928471', 'A1'), ('01928472', 'C'), ('01928473', 'A1'), ('01928474', 'C'),
('01928485', 'A1'), ('01928486', 'A1'), ('01928487', 'A1'),
('01928488', 'C'), ('01928489', 'D'), ('01928490', 'FC');

-- 28. Bảng Tai_xe_noi_thanh
INSERT INTO Tai_xe_noi_thanh (CCCD, khu_vuc_hoat_dong, bien_so_xe) VALUES
('01928471', N'Quan Cau Giay', '29A-11111'), ('01928473', N'Quan Hai Chau', '43A-44444'),
('01928485', N'HN', '29A-11111'), ('01928486', N'HN', '29A-11111'), ('01928487', N'HN', '29A-11111'); 

-- 29. Bảng Tai_xe_lien_tinh
INSERT INTO Tai_xe_lien_tinh (CCCD, trang_thai, ma_kho_lam_viec) VALUES
('01928472', 'SanSang', 'KHO_HN'), ('01928474', 'DangVanChuyen', 'KHO_HCM'),
('01928488', 'SanSang', 'KHO_DN'), ('01928489', 'NghiPhep', 'KHO_AG'), ('01928490', 'SanSang', 'KHO_CT');

-- 30. Bảng Tai_xe_NT_Van_chuyen_Hang_hoa (Cần STT của hàng hóa, giả định là 1)
INSERT INTO Tai_xe_NT_Van_chuyen_Hang_hoa (Ma_don, CCCD, STT) VALUES 
('DON01', '01928471', 1), 
('DON03', '01928473', 1),
('DON05', '01928471', 1), 
('DON02', '01928485', 1),
('DON04', '01928486', 1); 

-- 31. Bảng Quan_ly_tai_xe 
INSERT INTO Quan_ly_tai_xe (CCCD) VALUES 
('01928482'), ('01928483'), ('01928484'),
('01928499'), ('01928500'), ('01928501'),
('01928502'), ('01928503'), ('01928504'), ('01928505');

-- 32. Bảng Quan_ly_noi_thanh
INSERT INTO Quan_ly_noi_thanh (cccd, khu_vuc_quan_ly) VALUES 
('01928482', N'Ha Noi'), ('01928483', N'Da Nang'),
('01928499', N'HN'), ('01928500', N'HN'), ('01928501', N'HN');

-- 33. Bảng Quan_ly_lien_tinh
INSERT INTO Quan_ly_lien_tinh (CCCD) VALUES ('01928484'), ('01928502'), ('01928503'), ('01928504'), ('01928505');

-- 34. Bảng Quanli_TaixeNT
INSERT INTO Quanli_TaixeNT (CCCD_Taixe, CCCD_Quanli) VALUES 
('01928471', '01928482'), 
('01928473', '01928483'), 
('01928485', '01928499'),
('01928486', '01928500'), 
('01928487', '01928501'); 

-- 35. Bảng Quanli_TaixeLT
INSERT INTO Quanli_TaixeLT (CCCD_Taixe, CCCD_Quanli) VALUES 
('01928472', '01928484'), 
('01928474', '01928484'), 
('01928488', '01928502'), 
('01928489', '01928503'), 
('01928490', '01928504'); 

-- 36. Bảng Quanli_Phuongtienvan_chuyen
INSERT INTO Quanli_Phuongtienvan_chuyen (Bien_so_xe, CCCD) VALUES 
('51C-33333', '01928484'), 
('65C-55555', '01928484'),
('29A-11111', '01928502'),
('29A-22222', '01928503'), 
('43A-44444', '01928504'); 

INSERT INTO TaixeLT_Vanchuyen_Chuyenhang (Ma_chuyen_hang, CCCD) VALUES 
('CH01', '01928472'), ('CH03', '01928489'), ('CH05', '01928490');