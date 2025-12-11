USE BKExpress;
GO

CREATE OR ALTER PROCEDURE sp_DeleteVehicle
    @BienSoXe VARCHAR(15)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Phuong_tien_van_chuyen WHERE bien_so_xe = @BienSoXe)
    BEGIN
        RAISERROR(N'Không tìm thấy phương tiện với biển số này.', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM Phuong_tien_van_chuyen 
               WHERE bien_so_xe = @BienSoXe AND trang_thai = 'DangVanChuyen')
    BEGIN
        RAISERROR(N'Không thể xóa: Phương tiện đang trong quá trình vận chuyển.', 16, 1);
        RETURN;
    END

    BEGIN TRANSACTION;

    BEGIN TRY

        UPDATE Tai_xe_noi_thanh 
        SET bien_so_xe = NULL 
        WHERE bien_so_xe = @BienSoXe;

        DELETE FROM Quanli_Phuongtienvan_chuyen 
        WHERE Bien_so_xe = @BienSoXe;


        DELETE FROM Phuongtien_Vanchuyen_Chuyenhang 
        WHERE Bien_so_xe = @BienSoXe;


        DELETE FROM Phuong_tien_van_chuyen 
        WHERE bien_so_xe = @BienSoXe;


        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH

        ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO