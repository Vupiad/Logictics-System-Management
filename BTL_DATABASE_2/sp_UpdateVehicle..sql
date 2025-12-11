CREATE OR ALTER PROCEDURE sp_UpdateVehicle
    @BienSoXe VARCHAR(15),
    @TrangThai NVARCHAR(50),
    @TaiTrong INT,
    @LoaiXe NVARCHAR(255),
    @ViTriDo NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;


    IF @BienSoXe NOT LIKE '[0-9][0-9][A-Z]-[0-9][0-9][0-9][0-9][0-9]'
    BEGIN
        RAISERROR(N'Lỗi: Biển số xe không đúng định dạng (Ví dụ: 29A-11111).', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Phuong_tien_van_chuyen WHERE bien_so_xe = @BienSoXe)
    BEGIN
        RAISERROR(N'Lỗi: không tìm thấy phương tiện để cập nhật', 16, 1);
        RETURN;
    END

    IF @TrangThai NOT IN ('SanSang', 'DangVanChuyen')
    BEGIN
        RAISERROR(N'Lỗi: Trang thái phải là "SanSang" hoặc "DangVanChuyen".', 16, 1);
        RETURN;
    END

    BEGIN TRY
        UPDATE Phuong_tien_van_chuyen
        SET trang_thai = @TrangThai,
            tai_trong_tan = @TaiTrong,
            loai_xe = @LoaiXe,
            vi_tri_do = @ViTriDo
        WHERE bien_so_xe = @BienSoXe;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage2 NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage2, 16, 1);
    END CATCH
END;
GO