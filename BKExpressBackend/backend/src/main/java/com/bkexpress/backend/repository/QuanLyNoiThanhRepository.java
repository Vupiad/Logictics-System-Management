package com.bkexpress.backend.repository;

import com.bkexpress.backend.entity.QuanLyNoiThanh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuanLyNoiThanhRepository extends JpaRepository<QuanLyNoiThanh, String> {}
