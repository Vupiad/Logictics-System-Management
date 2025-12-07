package com.bkexpress.backend.service;

import com.bkexpress.backend.entity.Vehicle;
import com.bkexpress.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {
    @Autowired
    private VehicleRepository vehicleRepository;
    public Vehicle saveVehicle(Vehicle vehicle){
        return vehicleRepository.save(vehicle);
    }
    public List<Vehicle> getAllVehicles(){
        return vehicleRepository.findAll();
    }
    public Optional<Vehicle> getVehiclesByBienSoXe(String bienSoXe){
        return vehicleRepository.findById(bienSoXe);
    }

//    public Vehicle updateVehicle(String bienSoXe, Vehicle vehicleDetails){
//        Vehicle vehicle = vehicleRepository.findById(bienSoXe).orElseThrow(() -> new RuntimeException("Can't find vehicle"));
//        vehicle.setBienSoXe(vehicleDetails.getBienSoXe());
//        vehicle.setLoaiXe(vehicleDetails.getLoaiXe());
//        vehicle.setTaiTrong(vehicleDetails.getTaiTrong());
//        vehicle.setViTriDo(vehicleDetails.getViTriDo());
//        vehicle.setTrangThai(vehicleDetails.getTrangThai());
//
//        return vehicleRepository.save(vehicle);
//    }

    @Transactional
    public void addVehicle(Vehicle xe) {
        try {
            vehicleRepository.addVehicleByProcedure(
                    xe.getBienSoXe(),
                    xe.getTrangThai(),
                    xe.getTaiTrong(),
                    xe.getLoaiXe(),
                    xe.getViTriDo()
            );
        } catch (Exception e) {
            throw new RuntimeException(extractSqlError(e));
        }
    }
    @Transactional
    public void updateVehicle(String bienSo, Vehicle xe) {
        // Đảm bảo ID trong object khớp với ID trên URL
        if (!bienSo.equals(xe.getBienSoXe())) {
            throw new RuntimeException("Biển số xe trên URL và trong dữ liệu không khớp!");
        }

        try {
            vehicleRepository.updateVehicleByProcedure(
                    xe.getBienSoXe(),
                    xe.getTrangThai(),
                    xe.getTaiTrong(),
                    xe.getLoaiXe(),
                    xe.getViTriDo()
            );
        } catch (Exception e) {
            throw new RuntimeException(extractSqlError(e));
        }
    }

    // Hàm phụ để lấy thông báo lỗi sạch từ SQL Server
    private String extractSqlError(Exception e) {
        Throwable rootCause = e;
        while (rootCause.getCause() != null && rootCause.getCause() != rootCause) {
            rootCause = rootCause.getCause();
        }
        return rootCause.getMessage();
    }
    @Transactional
    public void deleteVehicle(String bienSoXe) {
        try {
            vehicleRepository.deleteVehicleByProcedure(bienSoXe);
        } catch (Exception e) {
            // Lấy thông báo lỗi từ SQL Server (RAISERROR)
            // Lỗi sẽ nằm sâu trong cause, ta cần lấy root cause
            Throwable rootCause = e;
            while (rootCause.getCause() != null && rootCause.getCause() != rootCause) {
                rootCause = rootCause.getCause();
            }

            // rootCause.getMessage() sẽ là: "Không thể xóa: Phương tiện đang trong quá trình vận chuyển."
            throw new RuntimeException(rootCause.getMessage());
        }
    }
}
