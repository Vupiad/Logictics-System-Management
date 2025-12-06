package com.bkexpress.backend.service;

import com.bkexpress.backend.entity.*;
import com.bkexpress.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional // Đảm bảo tính toàn vẹn dữ liệu khi Thêm/Sửa/Xóa
public class EmployeeService {

    @Autowired private NhanVienKhoRepository khoRepo;
    @Autowired private NhanVienCSKHRepository cskhRepo;
    @Autowired private TaiXeNoiThanhRepository txNoiThanhRepo;
    @Autowired private TaiXeLienTinhRepository txLienTinhRepo;
    @Autowired private QuanLyNoiThanhRepository qlNoiThanhRepo;
    @Autowired private QuanLyLienTinhRepository qlLienTinhRepo;
    @Autowired private NhanVienRepository nhanVienRepo;


    private void updateNhanVienCommon(NhanVien nvCu, NhanVien nvMoi) {
        nvCu.setHoTen(nvMoi.getHoTen());
        nvCu.setSdt(nvMoi.getSdt());
        nvCu.setDiaChi(nvMoi.getDiaChi());
        nvCu.setStk(nvMoi.getStk());
        nvCu.setGioiTinh(nvMoi.getGioiTinh());
        nvCu.setNamSinh(nvMoi.getNamSinh());
        nvCu.setLuongCoBan(nvMoi.getLuongCoBan());
        nvCu.setSoNgayLamViec(nvMoi.getSoNgayLamViec());
        // Không cập nhật CCCD, Ma_NV, Ma_TK (thường là cố định)
    }
    // get all employees
    public List<NhanVien> getAllEmployees() {
        return nhanVienRepo.findAll();
    }
    // ================= 1. NHÂN VIÊN KHO =================
    public List<NhanVienKho> getAllKho() { return khoRepo.findAll(); }

    public NhanVienKho createKho(NhanVienKho nv) { return khoRepo.save(nv); }

    public NhanVienKho updateKho(String cccd, NhanVienKho nvMoi) {
        return khoRepo.findById(cccd).map(nvCu -> {
            updateNhanVienCommon(nvCu, nvMoi);
            nvCu.setCaLam(nvMoi.getCaLam());
            nvCu.setNgayBatDauLam(nvMoi.getNgayBatDauLam());
            return khoRepo.save(nvCu);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy NV Kho: " + cccd));
    }

    public void deleteKho(String cccd) { khoRepo.deleteById(cccd); }

    // ================= 2. CSKH =================
    public List<NhanVienCSKH> getAllCSKH() { return cskhRepo.findAll(); }

    public NhanVienCSKH createCSKH(NhanVienCSKH nv) { return cskhRepo.save(nv); }

    public NhanVienCSKH updateCSKH(String cccd, NhanVienCSKH nvMoi) {
        return cskhRepo.findById(cccd).map(nvCu -> {
            updateNhanVienCommon(nvCu, nvMoi);
            return cskhRepo.save(nvCu);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy CSKH: " + cccd));
    }

    public void deleteCSKH(String cccd) { cskhRepo.deleteById(cccd); }

    // ================= 3. TÀI XẾ NỘI THÀNH =================
    public List<TaiXeNoiThanh> getAllTxNoiThanh() { return txNoiThanhRepo.findAll(); }

    public TaiXeNoiThanh createTxNoiThanh(TaiXeNoiThanh nv) { return txNoiThanhRepo.save(nv); }

    public TaiXeNoiThanh updateTxNoiThanh(String cccd, TaiXeNoiThanh nvMoi) {
        return txNoiThanhRepo.findById(cccd).map(nvCu -> {
            updateNhanVienCommon(nvCu, nvMoi);
            nvCu.setBangLaiXe(nvMoi.getBangLaiXe()); // Của bảng TaiXe
            nvCu.setBienSoXe(nvMoi.getBienSoXe());   // Của bảng TaiXeNoiThanh
            nvCu.setKhuVucHoatDong(nvMoi.getKhuVucHoatDong());
            return txNoiThanhRepo.save(nvCu);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy Tài xế nội thành: " + cccd));
    }

    public void deleteTxNoiThanh(String cccd) { txNoiThanhRepo.deleteById(cccd); }

    // ================= 4. TÀI XẾ LIÊN TỈNH =================
    public List<TaiXeLienTinh> getAllTxLienTinh() { return txLienTinhRepo.findAll(); }

    public TaiXeLienTinh createTxLienTinh(TaiXeLienTinh nv) { return txLienTinhRepo.save(nv); }

    public TaiXeLienTinh updateTxLienTinh(String cccd, TaiXeLienTinh nvMoi) {
        return txLienTinhRepo.findById(cccd).map(nvCu -> {
            updateNhanVienCommon(nvCu, nvMoi);
            nvCu.setBangLaiXe(nvMoi.getBangLaiXe());
            nvCu.setTrangThai(nvMoi.getTrangThai());
            nvCu.setMaKhoLamViec(nvMoi.getMaKhoLamViec());
            return txLienTinhRepo.save(nvCu);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy Tài xế liên tỉnh: " + cccd));
    }

    public void deleteTxLienTinh(String cccd) { txLienTinhRepo.deleteById(cccd); }

    // ================= 5. QUẢN LÝ NỘI THÀNH =================
    public List<QuanLyNoiThanh> getAllQlNoiThanh() { return qlNoiThanhRepo.findAll(); }

    public QuanLyNoiThanh createQlNoiThanh(QuanLyNoiThanh nv) { return qlNoiThanhRepo.save(nv); }

    public QuanLyNoiThanh updateQlNoiThanh(String cccd, QuanLyNoiThanh nvMoi) {
        return qlNoiThanhRepo.findById(cccd).map(nvCu -> {
            updateNhanVienCommon(nvCu, nvMoi);
            nvCu.setKhuVucQuanLy(nvMoi.getKhuVucQuanLy());
            return qlNoiThanhRepo.save(nvCu);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy QL Nội thành: " + cccd));
    }

    public void deleteQlNoiThanh(String cccd) { qlNoiThanhRepo.deleteById(cccd); }

    // ================= 6. QUẢN LÝ LIÊN TỈNH =================
    public List<QuanLyLienTinh> getAllQlLienTinh() { return qlLienTinhRepo.findAll(); }

    public QuanLyLienTinh createQlLienTinh(QuanLyLienTinh nv) { return qlLienTinhRepo.save(nv); }

    public QuanLyLienTinh updateQlLienTinh(String cccd, QuanLyLienTinh nvMoi) {
        return qlLienTinhRepo.findById(cccd).map(nvCu -> {
            updateNhanVienCommon(nvCu, nvMoi);
            return qlLienTinhRepo.save(nvCu);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy QL Liên tỉnh: " + cccd));
    }

    public void deleteQlLienTinh(String cccd) { qlLienTinhRepo.deleteById(cccd); }
}
