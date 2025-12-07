package com.bkexpress.backend.repository;

import com.bkexpress.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    @Modifying // Bắt buộc vì SP này làm thay đổi dữ liệu (Delete/Update)
    @Query(value = "EXEC sp_DeleteVehicle :bienSoXe", nativeQuery = true)
    void deleteVehicleByProcedure(@Param("bienSoXe") String bienSoXe);

    @Modifying
    @Query(value = "EXEC sp_AddVehicle :bienSo, :trangThai, :taiTrong, :loaiXe, :viTri", nativeQuery = true)
    void addVehicleByProcedure(
            @Param("bienSo") String bienSo,
            @Param("trangThai") String trangThai,
            @Param("taiTrong") Integer taiTrong,
            @Param("loaiXe") String loaiXe,
            @Param("viTri") String viTri
    );

    // Gọi SP Cập Nhật
    @Modifying
    @Query(value = "EXEC sp_UpdateVehicle :bienSo, :trangThai, :taiTrong, :loaiXe, :viTri", nativeQuery = true)
    void updateVehicleByProcedure(
            @Param("bienSo") String bienSo,
            @Param("trangThai") String trangThai,
            @Param("taiTrong") Integer taiTrong,
            @Param("loaiXe") String loaiXe,
            @Param("viTri") String viTri
    );
    @Query(value = "EXEC sp_LayXeVaQuanLyLienTinh :trangThai, :sapXep", nativeQuery = true)
    List<Map<String, Object>> getVehiclesWithManager(
            @Param("trangThai") String trangThai,
            @Param("sapXep") String sapXep
    );

    // 2. Gọi SP thống kê xe của Quản lý
    @Query(value = "EXEC sp_ThongKeXeCuaQuanLy :soLuong", nativeQuery = true)
    List<Map<String, Object>> getManagerStats(@Param("soLuong") Integer soLuong);
}
