package com.bkexpress.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "Nhan_vien_CSKH")
@PrimaryKeyJoinColumn(name = "CCCD")
@Data
@EqualsAndHashCode(callSuper = true)
public class NhanVienCSKH extends NhanVien {
    // Bảng này trong SQL không có cột riêng, chỉ dùng ID tham chiếu
}