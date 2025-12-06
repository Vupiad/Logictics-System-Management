package com.bkexpress.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "Quan_ly_noi_thanh")
@PrimaryKeyJoinColumn(name = "cccd") // Lưu ý: trong SQL bạn viết thường 'cccd'
@Data
@EqualsAndHashCode(callSuper = true)
public class QuanLyNoiThanh extends QuanLyTaiXe {

    @Column(name = "khu_vuc_quan_ly")
    private String khuVucQuanLy;

    public String getKhuVucQuanLy() {
        return khuVucQuanLy;
    }

    public void setKhuVucQuanLy(String khuVucQuanLy) {
        this.khuVucQuanLy = khuVucQuanLy;
    }
}