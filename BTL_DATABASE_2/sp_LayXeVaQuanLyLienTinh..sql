USE BKExpress;
GO

CREATE OR ALTER PROCEDURE sp_LayXeVaQuanLyLienTinh
    @TrangThai NVARCHAR(50),
    @SapXepTheo VARCHAR(20)
AS
BEGIN
    SELECT 
        pt.bien_so_xe,
        pt.loai_xe,
        pt.tai_trong_tan,
        pt.trang_thai,
        pt.vi_tri_do,
        nv.ho_ten AS ten_quan_ly,
        nv.sdt AS sdt_quan_ly
        nv.CCCD AS cccd_quan_ly
    FROM Phuong_tien_van_chuyen pt

    LEFT JOIN Quanli_Phuongtienvan_chuyen qlpt ON pt.bien_so_xe = qlpt.Bien_so_xe

    LEFT JOIN NhanVien nv ON qlpt.CCCD = nv.CCCD

    LEFT JOIN Quan_ly_lien_tinh qllt ON nv.CCCD = qllt.CCCD
    
    WHERE 
        (@TrangThai IS NULL OR pt.trang_thai = @TrangThai)
        
    ORDER BY 
        CASE WHEN @SapXepTheo = 'TaiTrong' THEN pt.tai_trong_tan END DESC,
        CASE WHEN @SapXepTheo = 'BienSo' THEN pt.bien_so_xe END ASC;
END;
GO