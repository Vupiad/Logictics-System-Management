USE BKExpress;
GO

CREATE OR ALTER PROCEDURE sp_LayXeVaQuanLyLienTinh
    @TrangThai NVARCHAR(50), -- Tham s? di?u ki?n WHERE (Có th? NULL)
    @SapXepTheo VARCHAR(20)  -- Tham s? ORDER BY ('TaiTrong' ho?c 'BienSo')
AS
BEGIN
    SELECT 
        pt.bien_so_xe,
        pt.loai_xe,
        pt.tai_trong_tan,
        pt.trang_thai,
        pt.vi_tri_do,
        -- L?y tên Qu?n lý (n?u xe dã du?c phân công)
        nv.ho_ten AS ten_quan_ly,
        nv.sdt AS sdt_quan_ly
    FROM Phuong_tien_van_chuyen pt
    -- Join b?ng trung gian d? tìm ai qu?n lý xe này
    LEFT JOIN Quanli_Phuongtienvan_chuyen qlpt ON pt.bien_so_xe = qlpt.Bien_so_xe
    -- Join b?ng Nhân viên d? l?y tên c?a ông qu?n lý dó
    LEFT JOIN NhanVien nv ON qlpt.CCCD = nv.CCCD
    -- Join b?ng Qu?n lý liên t?nh d? d?m b?o dúng role (tu? ch?n, nhung nên có d? ch?t ch?)
    LEFT JOIN Quan_ly_lien_tinh qllt ON nv.CCCD = qllt.CCCD
    
    WHERE 
        (@TrangThai IS NULL OR pt.trang_thai = @TrangThai) -- Ði?u ki?n l?c linh d?ng
        
    ORDER BY 
        CASE WHEN @SapXepTheo = 'TaiTrong' THEN pt.tai_trong_tan END DESC,
        CASE WHEN @SapXepTheo = 'BienSo' THEN pt.bien_so_xe END ASC;
END;
GO