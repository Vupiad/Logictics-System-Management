package com.bkexpress.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "Quan_ly_lien_tinh")
@PrimaryKeyJoinColumn(name = "CCCD")
@Data
@EqualsAndHashCode(callSuper = true)
public class QuanLyLienTinh extends QuanLyTaiXe {
    // Không có cột riêng
}