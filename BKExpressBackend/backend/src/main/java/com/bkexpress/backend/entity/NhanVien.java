package com.bkexpress.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "NhanVien")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
public class NhanVien {
    @Id
    @Column(name = "CCCD", length = 12)
    private String cccd;

    @Column(name = "Ma_NV")
    private String maNV;
    @Column(name = "ho_ten")
    private String hoTen;
    @Column(name = "dia_chi")
    private String diaChi;
    @Column(name = "sdt")
    private String sdt;
    @Column(name = "STK")
    private String stk;
    @Column(name = "gioi_tinh")
    private String gioiTinh;
    @Column(name = "nam_sinh")
    private Integer namSinh;
    @Column(name = "ma_TK")
    private Integer maTK;
    @Column(name = "luong_co_ban")
    private Integer luongCoBan;
    @Column(name = "chuc_vu")
    private String chucVu;
    @Column(name = "so_ngay_lam_viec")
    private Integer soNgayLamViec;
    @Column(name = "luong")
    private Integer luong;

    public Integer getNamSinh() {
        return namSinh;
    }

    public void setNamSinh(Integer namSinh) {
        this.namSinh = namSinh;
    }

    public String getCccd() {
        return cccd;
    }

    public void setCccd(String cccd) {
        this.cccd = cccd;
    }

    public String getMaNV() {
        return maNV;
    }

    public void setMaNV(String maNV) {
        this.maNV = maNV;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public String getStk() {
        return stk;
    }

    public void setStk(String stk) {
        this.stk = stk;
    }

    public String getGioiTinh() {
        return gioiTinh;
    }

    public void setGioiTinh(String gioiTinh) {
        this.gioiTinh = gioiTinh;
    }

    public Integer getMaTK() {
        return maTK;
    }

    public void setMaTK(Integer maTK) {
        this.maTK = maTK;
    }

    public Integer getLuongCoBan() {
        return luongCoBan;
    }

    public void setLuongCoBan(Integer luongCoBan) {
        this.luongCoBan = luongCoBan;
    }

    public String getChucVu() {
        return chucVu;
    }

    public void setChucVu(String chucVu) {
        this.chucVu = chucVu;
    }

    public Integer getSoNgayLamViec() {
        return soNgayLamViec;
    }

    public void setSoNgayLamViec(Integer soNgayLamViec) {
        this.soNgayLamViec = soNgayLamViec;
    }

    public Integer getLuong() {
        return luong;
    }

    public void setLuong(Integer luong) {
        this.luong = luong;
    }
}
