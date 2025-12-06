package com.bkexpress.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "Tai_xe_lien_tinh")
@PrimaryKeyJoinColumn(name = "CCCD")
@Data
@EqualsAndHashCode(callSuper = true)
public class TaiXeLienTinh extends TaiXe {

    @Column(name = "trang_thai")
    private String trangThai; // SanSang, DangVanChuyen...

    @Column(name = "ma_kho_lam_viec")
    private String maKhoLamViec;

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public String getMaKhoLamViec() {
        return maKhoLamViec;
    }

    public void setMaKhoLamViec(String maKhoLamViec) {
        this.maKhoLamViec = maKhoLamViec;
    }
}