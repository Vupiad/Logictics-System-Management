package com.bkexpress.backend.controller;

import com.bkexpress.backend.entity.Vehicle;
import com.bkexpress.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public List<Vehicle> getAll(){
        return vehicleService.getAllVehicles();
    }
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Vehicle xe) {
        try {
            vehicleService.addVehicle(xe);
            return ResponseEntity.ok("Thêm xe thành công: " + xe.getBienSoXe());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/{bienSo}")
    public ResponseEntity<?> update(@PathVariable String bienSo, @RequestBody Vehicle xe) {
        // Gán lại biển số từ URL vào object để đảm bảo consistency
        xe.setBienSoXe(bienSo);
        try {
            vehicleService.updateVehicle(bienSo, xe);
            return ResponseEntity.ok("Cập nhật xe thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/{bienSoXe}")
    public ResponseEntity<?> deleteVehicle(@PathVariable String bienSoXe) {
        try {
            vehicleService.deleteVehicle(bienSoXe);
            return ResponseEntity.ok("Xóa phương tiện thành công!");
        } catch (RuntimeException e) {
            // Trả về lỗi 400 Bad Request kèm lý do (ví dụ: Xe đang bận)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // GET http://localhost:8080/api/vehicles/list-manager?trangThai=SanSang&sapXep=TaiTrong
    @GetMapping("/list-manager")
    public ResponseEntity<?> getListWithManager(
            @RequestParam(required = false) String trangThai,
            @RequestParam(defaultValue = "TaiTrong") String sapXep) {

        return ResponseEntity.ok(vehicleService.getVehiclesWithManager(trangThai, sapXep));
    }

    // GET http://localhost:8080/api/vehicles/manager-stats?min=1
    @GetMapping("/manager-stats")
    public ResponseEntity<?> getManagerStats(@RequestParam(defaultValue = "1") Integer min) {

        return ResponseEntity.ok(vehicleService.getManagerStats(min));
    }

}
