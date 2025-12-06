package com.bkexpress.backend.repository;

import com.bkexpress.backend.entity.QuanLyLienTinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuanLyLienTinhRepository extends JpaRepository<QuanLyLienTinh, String> {}
