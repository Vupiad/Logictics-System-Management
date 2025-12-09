CREATE OR ALTER PROCEDURE sp_UpdateVehicle
    @BienSoXe VARCHAR(15),
    @TrangThai NVARCHAR(50),
    @TaiTrong INT,
    @LoaiXe NVARCHAR(255),
    @ViTriDo NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- VALIDATE 1: Ki?m tra d?nh d?ng bi?n s? (Dù là update nhung d?u vào v?n ph?i chu?n)
    IF @BienSoXe NOT LIKE '[0-9][0-9][A-Z]-[0-9][0-9][0-9][0-9][0-9]'
    BEGIN
        RAISERROR(N'L?i: Bi?n s? xe không dúng d?nh d?ng (Ví d?: 29A-11111).', 16, 1);
        RETURN;
    END

    -- VALIDATE 2: Ki?m tra xe có t?n t?i không
    IF NOT EXISTS (SELECT 1 FROM Phuong_tien_van_chuyen WHERE bien_so_xe = @BienSoXe)
    BEGIN
        RAISERROR(N'L?i: Không tìm th?y phuong ti?n c?n c?p nh?t.', 16, 1);
        RETURN;
    END

    -- VALIDATE 3: Ki?m tra tr?ng thái
    IF @TrangThai NOT IN ('SanSang', 'DangVanChuyen')
    BEGIN
        RAISERROR(N'L?i: Tr?ng thái ph?i là "SanSang" ho?c "DangVanChuyen".', 16, 1);
        RETURN;
    END

    -- TH?C HI?N UPDATE
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