package com.bkexpress.backend.controller;

import com.bkexpress.backend.entity.*;
import com.bkexpress.backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    // ================= 1. KHO =================
    @GetMapping("/kho")
    public List<NhanVienKho> getKho() { return service.getAllKho(); }

    @PostMapping("/kho")
    public NhanVienKho addKho(@RequestBody NhanVienKho nv) { return service.createKho(nv); }

    @PutMapping("/kho/{id}")
    public NhanVienKho updateKho(@PathVariable String id, @RequestBody NhanVienKho nv) {
        return service.updateKho(id, nv);
    }

    @DeleteMapping("/kho/{id}")
    public ResponseEntity<Void> deleteKho(@PathVariable String id) {
        service.deleteKho(id);
        return ResponseEntity.ok().build();
    }

    // ================= 2. CSKH =================
    @GetMapping("/cskh")
    public List<NhanVienCSKH> getCSKH() { return service.getAllCSKH(); }

    @PostMapping("/cskh")
    public NhanVienCSKH addCSKH(@RequestBody NhanVienCSKH nv) { return service.createCSKH(nv); }

    @PutMapping("/cskh/{id}")
    public NhanVienCSKH updateCSKH(@PathVariable String id, @RequestBody NhanVienCSKH nv) {
        return service.updateCSKH(id, nv);
    }

    @DeleteMapping("/cskh/{id}")
    public ResponseEntity<Void> deleteCSKH(@PathVariable String id) {
        service.deleteCSKH(id);
        return ResponseEntity.ok().build();
    }

    // ================= 3. TÀI XẾ NỘI THÀNH =================
    @GetMapping("/tx-noi-thanh")
    public List<TaiXeNoiThanh> getTxNT() { return service.getAllTxNoiThanh(); }

    @PostMapping("/tx-noi-thanh")
    public TaiXeNoiThanh addTxNT(@RequestBody TaiXeNoiThanh nv) { return service.createTxNoiThanh(nv); }

    @PutMapping("/tx-noi-thanh/{id}")
    public TaiXeNoiThanh updateTxNT(@PathVariable String id, @RequestBody TaiXeNoiThanh nv) {
        return service.updateTxNoiThanh(id, nv);
    }

    @DeleteMapping("/tx-noi-thanh/{id}")
    public ResponseEntity<Void> deleteTxNT(@PathVariable String id) {
        service.deleteTxNoiThanh(id);
        return ResponseEntity.ok().build();
    }

    // ================= 4. TÀI XẾ LIÊN TỈNH =================
    @GetMapping("/tx-lien-tinh")
    public List<TaiXeLienTinh> getTxLT() { return service.getAllTxLienTinh(); }

    @PostMapping("/tx-lien-tinh")
    public TaiXeLienTinh addTxLT(@RequestBody TaiXeLienTinh nv) { return service.createTxLienTinh(nv); }

    @PutMapping("/tx-lien-tinh/{id}")
    public TaiXeLienTinh updateTxLT(@PathVariable String id, @RequestBody TaiXeLienTinh nv) {
        return service.updateTxLienTinh(id, nv);
    }

    @DeleteMapping("/tx-lien-tinh/{id}")
    public ResponseEntity<Void> deleteTxLT(@PathVariable String id) {
        service.deleteTxLienTinh(id);
        return ResponseEntity.ok().build();
    }

    // ================= 5. QUẢN LÝ NỘI THÀNH =================
    @GetMapping("/ql-noi-thanh")
    public List<QuanLyNoiThanh> getQlNT() { return service.getAllQlNoiThanh(); }

    @PostMapping("/ql-noi-thanh")
    public QuanLyNoiThanh addQlNT(@RequestBody QuanLyNoiThanh nv) { return service.createQlNoiThanh(nv); }

    @PutMapping("/ql-noi-thanh/{id}")
    public QuanLyNoiThanh updateQlNT(@PathVariable String id, @RequestBody QuanLyNoiThanh nv) {
        return service.updateQlNoiThanh(id, nv);
    }

    @DeleteMapping("/ql-noi-thanh/{id}")
    public ResponseEntity<Void> deleteQlNT(@PathVariable String id) {
        service.deleteQlNoiThanh(id);
        return ResponseEntity.ok().build();
    }

    // ================= 6. QUẢN LÝ LIÊN TỈNH =================
    @GetMapping("/ql-lien-tinh")
    public List<QuanLyLienTinh> getQlLT() { return service.getAllQlLienTinh(); }

    @PostMapping("/ql-lien-tinh")
    public QuanLyLienTinh addQlLT(@RequestBody QuanLyLienTinh nv) { return service.createQlLienTinh(nv); }

    @PutMapping("/ql-lien-tinh/{id}")
    public QuanLyLienTinh updateQlLT(@PathVariable String id, @RequestBody QuanLyLienTinh nv) {
        return service.updateQlLienTinh(id, nv);
    }

    @DeleteMapping("/ql-lien-tinh/{id}")
    public ResponseEntity<Void> deleteQlLT(@PathVariable String id) {
        service.deleteQlLienTinh(id);
        return ResponseEntity.ok().build();
    }
}
