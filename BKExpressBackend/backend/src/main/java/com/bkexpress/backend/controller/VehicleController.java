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
    public Vehicle create(@RequestBody Vehicle vehicle){
        return vehicleService.saveVehicle(vehicle);
    }
    @PutMapping("/{bien_so_xe}")
    public ResponseEntity<Vehicle> update(@PathVariable String bien_so_xe, @RequestBody Vehicle vehicle){
        try {
            return ResponseEntity.ok(vehicleService.updateVehicle(bien_so_xe, vehicle));
        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{bien_so_xe}")
    public ResponseEntity<Void> delete(@PathVariable String bien_so_xe){
        vehicleService.deleteVehicle(bien_so_xe);
        return ResponseEntity.ok().build();
    }
}
