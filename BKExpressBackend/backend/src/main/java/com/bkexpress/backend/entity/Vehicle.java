package com.bkexpress.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
@Entity
@Table(name = "Phuong_tien_van_chuyen")
@Data
public class Vehicle {
    @Id
    @Column(name = "bien_so_xe")
    private String bienSoXe;

    @Column(name = "trang_thai")
    private String trangThai;



    @Column(name = "tai_trong_tan")
    private Integer taiTrong;

    @Column(name = "loai_xe")
    private String loaiXe;

    @Column(name = "vi_tri_do")
    private String viTriDo;

    public Integer getTaiTrong() {
        return taiTrong;
    }

    public void setTaiTrong(Integer taiTrong) {
        this.taiTrong = taiTrong;
    }
    public void setBienSoXe(String bienSoXe) {
        this.bienSoXe = bienSoXe;
    }

    public String getBienSoXe() {
        return bienSoXe;
    }

    public void setViTriDo(String viTriDo) {
        this.viTriDo = viTriDo;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public String getViTriDo() {
        return viTriDo;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public String getLoaiXe() {
        return loaiXe;
    }

    public void setLoaiXe(String loaiXe) {
        this.loaiXe = loaiXe;
    }

}
