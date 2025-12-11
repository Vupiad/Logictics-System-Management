USE BKExpress;
GO

CREATE OR ALTER PROCEDURE sp_AddVehicle
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
        RAISERROR(N'Lỗi: Biển số xe không đúng định dạng(Ví dụ: 29A-11111).', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM Phuong_tien_van_chuyen WHERE bien_so_xe = @BienSoXe)
    BEGIN
        RAISERROR(N'Lỗi: Biểu số xe đã tồn tại trong hệ thống.', 16, 1);
        RETURN;
    END

    IF @TrangThai NOT IN ('SanSang', 'DangVanChuyen')
    BEGIN
        RAISERROR(N'Lỗi: Vui lòng chọn trạng thái là "SanSang" hoặc "DangVanChuyen"', 16, 1);
        RETURN;
    END

    BEGIN TRY
        INSERT INTO Phuong_tien_van_chuyen (bien_so_xe, trang_thai, tai_trong_tan, loai_xe, vi_tri_do)
        VALUES (@BienSoXe, @TrangThai, @TaiTrong, @LoaiXe, @ViTriDo);
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO