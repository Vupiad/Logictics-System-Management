USE BKExpress
GO

EXEC sp_addVehicle
	@BienSoXe = '29C-99999',
	@TrangThai = 'SangSan',
	@TaiTrong = 10,
	@LoaiXe = N'Xe tải hạng nặng',
	@ViTriDo = N'Kho Hà Nội';
GO