package com.bkexpress.backend.service;

import com.bkexpress.backend.entity.Vehicle;
import com.bkexpress.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Vehicle updateVehicle(String bienSoXe, Vehicle vehicleDetails){
        Vehicle vehicle = vehicleRepository.findById(bienSoXe).orElseThrow(() -> new RuntimeException("Can't find vehicle"));
        vehicle.setBienSoXe(vehicleDetails.getBienSoXe());
        vehicle.setLoaiXe(vehicleDetails.getLoaiXe());
        vehicle.setTaiTrong(vehicleDetails.getTaiTrong());
        vehicle.setViTriDo(vehicleDetails.getViTriDo());
        vehicle.setTrangThai(vehicleDetails.getTrangThai());

        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(String bienSoXe){
        vehicleRepository.deleteById(bienSoXe);
    }
}
