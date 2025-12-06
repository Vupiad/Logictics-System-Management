package com.bkexpress.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

import java.time.LocalDate;


@Entity
@Table(name = "Nhan_vien_kho")
@PrimaryKeyJoinColumn(name = "CCCD")

public class NhanVienKho extends NhanVien{
    @Column(name = "ca_lam")
    private String caLam;

    @Column(name = "ngay_bat_dau_lam")
    private LocalDate ngayBatDauLam;
    public LocalDate getNgayBatDauLam() {
        return ngayBatDauLam;
    }

    public void setNgayBatDauLam(LocalDate ngayBatDauLam) {
        this.ngayBatDauLam = ngayBatDauLam;
    }

    public String getCaLam() {
        return caLam;
    }

    public void setCaLam(String caLam) {
        this.caLam = caLam;
    }
}
