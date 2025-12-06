package com.bkexpress.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "Tai_xe_noi_thanh")
@PrimaryKeyJoinColumn(name = "CCCD")
@Data
@EqualsAndHashCode(callSuper = true)
public class TaiXeNoiThanh extends TaiXe {

    @Column(name = "khu_vuc_hoat_dong")
    private String khuVucHoatDong;

    @Column(name = "bien_so_xe")
    private String bienSoXe;

    public String getKhuVucHoatDong() {
        return khuVucHoatDong;
    }

    public void setKhuVucHoatDong(String khuVucHoatDong) {
        this.khuVucHoatDong = khuVucHoatDong;
    }

    public String getBienSoXe() {
        return bienSoXe;
    }

    public void setBienSoXe(String bienSoXe) {
        this.bienSoXe = bienSoXe;
    }
}