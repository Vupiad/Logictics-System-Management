package com.bkexpress.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "Quan_ly_tai_xe")
@PrimaryKeyJoinColumn(name = "CCCD")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@EqualsAndHashCode(callSuper = true)
public class QuanLyTaiXe extends NhanVien {
    // Không có cột riêng trong bảng này
}