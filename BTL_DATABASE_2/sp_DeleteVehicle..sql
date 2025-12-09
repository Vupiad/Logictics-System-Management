USE BKExpress; -- Ð?m b?o ch?n dúng DB
GO

CREATE OR ALTER PROCEDURE sp_DeleteVehicle
    @BienSoXe VARCHAR(15)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- BU?C 1: Ki?m tra xem xe có t?n t?i không
    IF NOT EXISTS (SELECT 1 FROM Phuong_tien_van_chuyen WHERE bien_so_xe = @BienSoXe)
    BEGIN
        RAISERROR(N'Không tìm th?y phuong ti?n v?i bi?n s? này.', 16, 1);
        RETURN;
    END

    -- BU?C 2: Ki?m tra tr?ng thái "DangVanChuyen"
    IF EXISTS (SELECT 1 FROM Phuong_tien_van_chuyen 
               WHERE bien_so_xe = @BienSoXe AND trang_thai = 'DangVanChuyen')
    BEGIN
        RAISERROR(N'Không th? xóa: Phuong ti?n dang trong quá trình v?n chuy?n.', 16, 1);
        RETURN;
    END

    -- BU?C 3: B?t d?u giao d?ch (Transaction) d? d?m b?o an toàn
    BEGIN TRANSACTION;

    BEGIN TRY
        -- 3.1. G? xe kh?i Tài x? n?i thành (Set NULL thay vì xóa tài x?)
        -- Gi? l?i tài x?, ch? xóa thông tin xe h? dang lái
        UPDATE Tai_xe_noi_thanh 
        SET bien_so_xe = NULL 
        WHERE bien_so_xe = @BienSoXe;

        -- 3.2. Xóa kh?i b?ng Qu?n lý phuong ti?n (B?ng n?i v?i Qu?n lý)
        DELETE FROM Quanli_Phuongtienvan_chuyen 
        WHERE Bien_so_xe = @BienSoXe;

        -- 3.3. Xóa kh?i b?ng Phuong ti?n v?n chuy?n chuy?n hàng (L?ch s? chuy?n)
        -- Luu ý: Hành d?ng này s? làm m?t l?ch s? v?n chuy?n c?a xe này.
        DELETE FROM Phuongtien_Vanchuyen_Chuyenhang 
        WHERE Bien_so_xe = @BienSoXe;

        -- 3.4. Cu?i cùng: Xóa phuong ti?n trong b?ng chính
        DELETE FROM Phuong_tien_van_chuyen 
        WHERE bien_so_xe = @BienSoXe;

        -- N?u m?i th? ?n, xác nh?n giao d?ch
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- N?u có l?i, hoàn tác m?i th?
        ROLLBACK TRANSACTION;
        
        -- Ném l?i ra cho Java bi?t
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO