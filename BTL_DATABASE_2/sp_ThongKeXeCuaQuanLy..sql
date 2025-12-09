CREATE OR ALTER PROCEDURE sp_ThongKeXeCuaQuanLy
    @SoLuongToiThieu INT -- Tham s? HAVING
AS
BEGIN
    SELECT 
        nv.CCCD,
        nv.ho_ten,
        nv.sdt,
        COUNT(qlpt.Bien_so_xe) AS so_luong_xe_quan_ly,
        SUM(pt.tai_trong_tan) AS tong_tai_trong_doi_xe
    FROM NhanVien nv
    -- Ch? l?y nh?ng ngu?i là Qu?n lý liên t?nh
    JOIN Quan_ly_lien_tinh qllt ON nv.CCCD = qllt.CCCD
    -- Join d? d?m xe
    JOIN Quanli_Phuongtienvan_chuyen qlpt ON nv.CCCD = qlpt.CCCD
    JOIN Phuong_tien_van_chuyen pt ON qlpt.Bien_so_xe = pt.bien_so_xe
    
    WHERE pt.trang_thai = 'SanSang' -- Ch? d?m xe dang s?n sàng (M?nh d? WHERE)
    
    GROUP BY nv.CCCD, nv.ho_ten, nv.sdt -- Gom nhóm theo qu?n lý
    
    HAVING COUNT(qlpt.Bien_so_xe) >= @SoLuongToiThieu -- M?nh d? HAVING
    
    ORDER BY so_luong_xe_quan_ly DESC; -- M?nh d? ORDER BY
END;
GO