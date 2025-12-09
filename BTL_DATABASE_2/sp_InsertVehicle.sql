USE BKExpress;
GO

-- =============================================
-- 1. SP THÊM PH??NG TI?N (INSERT)
-- =============================================
CREATE OR ALTER PROCEDURE sp_AddVehicle
    @BienSoXe VARCHAR(15),
    @TrangThai NVARCHAR(50),
    @TaiTrong INT,
    @LoaiXe NVARCHAR(255),
    @ViTriDo NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- VALIDATE 1: Ki?m tra ??nh d?ng bi?n s?
    -- [0-9]: S?, [A-Z]: Ch? in hoa, -: D?u g?ch
    IF @BienSoXe NOT LIKE '[0-9][0-9][A-Z]-[0-9][0-9][0-9][0-9][0-9]'
    BEGIN
        RAISERROR(N'L?i: Bi?n s? xe không ?úng ??nh d?ng (Ví d?: 29A-11111).', 16, 1);
        RETURN;
    END

    -- VALIDATE 2: Ki?m tra trùng bi?n s? (Primary Key)
    IF EXISTS (SELECT 1 FROM Phuong_tien_van_chuyen WHERE bien_so_xe = @BienSoXe)
    BEGIN
        RAISERROR(N'L?i: Bi?n s? xe này ?ã t?n t?i trong h? th?ng.', 16, 1);
        RETURN;
    END

    -- VALIDATE 3: Ki?m tra tr?ng thái h?p l? (Enum gi? l?p)
    IF @TrangThai NOT IN ('SanSang', 'DangVanChuyen')
    BEGIN
        RAISERROR(N'L?i: Tr?ng thái ph?i là "SanSang" ho?c "DangVanChuyen".', 16, 1);
        RETURN;
    END

    -- TH?C HI?N INSERT
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