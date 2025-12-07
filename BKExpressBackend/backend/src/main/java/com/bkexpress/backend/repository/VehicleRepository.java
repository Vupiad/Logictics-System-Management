package com.bkexpress.backend.repository;

import com.bkexpress.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}
