CREATE OR ALTER PROCEDURE sp_ThongKeXeCuaQuanLy
    @SoLuongToiThieu INT
AS
BEGIN
    SELECT 
        nv.CCCD,
        nv.ho_ten,
        nv.sdt,
        COUNT(qlpt.Bien_so_xe) AS so_luong_xe_quan_ly,
        SUM(pt.tai_trong_tan) AS tong_tai_trong_doi_xe
    FROM NhanVien nv

    JOIN Quan_ly_lien_tinh qllt ON nv.CCCD = qllt.CCCD

    JOIN Quanli_Phuongtienvan_chuyen qlpt ON nv.CCCD = qlpt.CCCD
    JOIN Phuong_tien_van_chuyen pt ON qlpt.Bien_so_xe = pt.bien_so_xe
    
    WHERE pt.trang_thai = 'SanSang'
    
    GROUP BY nv.CCCD, nv.ho_ten, nv.sdt
    
    HAVING COUNT(qlpt.Bien_so_xe) >= @SoLuongToiThieu
    
    ORDER BY so_luong_xe_quan_ly DESC;
END;
GO