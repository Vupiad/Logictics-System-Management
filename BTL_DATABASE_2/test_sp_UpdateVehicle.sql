USE BKExpress
GO

EXEC sp_UpdateVehicle
	@BienSoXe = '29C-99999',
	@TrangThai = 'DangVanChuyen',
	@TaiTrong = 10,
	@LoaiXe = N'Xe tải hạng nặng',
	@ViTriDo = N'Kho Hà Nội';
GO