USE BKExpress
GO

EXEC sp_addVehicle
	@BienSoXe = '29C-99999',
	@TrangThai = 'SangSan',
	@TaiTrong = 10,
	@LoaiXe = N'Xe t?i h?ng n?ng',
	@ViTriDo = N'Kho Hà N?i';
GO