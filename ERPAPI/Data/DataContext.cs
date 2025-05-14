using ERPAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPAPI.Data;

public partial class DataContext : DbContext
{
  public DataContext() {}
  public DataContext(DbContextOptions<DataContext> options) : base(options) {}
  public virtual DbSet<BusinessUnit> BusinessUnits { get; set; }
  public virtual DbSet<Project> Projects { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<BusinessUnit>(entity =>
    {
      entity.ToTable("AcUnidadesNegocio");
      entity.HasKey(e => e.IdUnidadNegocio).HasFillFactor(95);
    });

    modelBuilder.Entity<Project>(entity =>
    {
      entity.ToTable("Proyectos");
      entity.HasKey(e => e.IdProyecto).HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaIvaTrasladado, "IX_Proyectos_1").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaDevolucionesClientesSaldoFavor, "IX_Proyectos_10").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaIngresosPorCancelaciones, "IX_Proyectos_12").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaCostoPorCasas, "IX_Proyectos_13").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaCostoPorTerrenos, "IX_Proyectos_14").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaTraspasoCostoPorTerrenos, "IX_Proyectos_15").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaAnticiposClientes, "IX_Proyectos_16").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaTraspasoCostoPorCasas, "IX_Proyectos_17").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaIngresosPorVentasCasas, "IX_Proyectos_18").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaIvaTrasladadoPorAplicar, "IX_Proyectos_19").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaIntereses, "IX_Proyectos_2").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaIngresosPorVentasTerrenos, "IX_Proyectos_20").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaMoratorios, "IX_Proyectos_21").HasFillFactor(90);
      entity.HasIndex(e => e.IdCuentaIvaalmacen, "IX_Proyectos_22").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaApartados, "IX_Proyectos_3").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaDepPorIdentificar, "IX_Proyectos_4").HasFillFactor(90);
      entity.HasIndex(e => e.CuentaInterCentro, "IX_Proyectos_5").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaDevolucionesClientes, "IX_Proyectos_6").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaClientes, "IX_Proyectos_7").HasFillFactor(90);
      entity.HasIndex(e => e.CvCtaGastosAdicionales, "IX_Proyectos_8").HasFillFactor(90);
      entity.HasIndex(e => e.IdCuentaAlmacen, "IX_Proyectos_9").HasFillFactor(90);

      entity.Property(e => e.AcContabilidad).HasDefaultValue(true);
      entity.Property(e => e.AcFacturas).HasDefaultValue(true);
      entity.Property(e => e.AcOcompra).HasDefaultValue(true);
      entity.Property(e => e.AcRequisiciones).HasDefaultValue(true);
      entity.Property(e => e.AoActCostoCantOriImp).HasDefaultValue(true);
      entity.Property(e => e.AoAgregarEstimaciones).HasDefaultValue(true);
      entity.Property(e => e.AoAgregarMovAlmacen).HasDefaultValue(true);
      entity.Property(e => e.AoAgregarSubcontratos).HasDefaultValue(true);
      entity.Property(e => e.AoControlPorPrototipo).HasDefaultValue(true);
      entity.Property(e => e.AoModificarEstimaciones).HasDefaultValue(true);
      entity.Property(e => e.AoModificarMovAlmacen).HasDefaultValue(true);
      entity.Property(e => e.AoModificarPresupC).HasDefaultValue(true);
      entity.Property(e => e.AoModificarSubcontratos).HasDefaultValue(true);
      entity.Property(e => e.AoValidarCostoDestajo).HasDefaultValue(true);
      entity.Property(e => e.AoValidarCostoSubcontrato).HasDefaultValue(true);
      entity.Property(e => e.CvAutenticacionWindowsAvanceObra).HasDefaultValue(false);
      entity.Property(e => e.CvFechaBloqueoAjustesClientes).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.CvFechaBloqueoApartados).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.CvFechaBloqueoCancelaciones).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.CvFechaBloqueoDepSofoles).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.CvFechaBloqueoDepositos).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.CvFechaBloqueoEscrituras).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.CvFechaBloqueoNotasCreditoCargo).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.CvFechaBloqueoPagos).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.CvIva).HasDefaultValue(0m);
      entity.Property(e => e.DiaCapturaAlmacen).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.FechaCheque).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.FechaContabilidad).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.FechaEstimaciones).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.FechaFacturaCliente).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.FechaFacturaProveedor).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.FechaPedido).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.FechaRequisicion).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.FechaSubContratos).HasDefaultValueSql("(CONVERT([datetime],CONVERT([varchar],getdate(),(1)),(1)))");
      entity.Property(e => e.GenerarRequisicionesComer).HasDefaultValue(true);
      entity.Property(e => e.Periodicidad).HasDefaultValue((short)1);
      entity.Property(e => e.PorcentajeIva).HasDefaultValue(0m);
      entity.Property(e => e.TipoGenPolizasAlmacen).HasDefaultValue((short)1);

      entity.HasOne(d => d.IdUnidadNegocioNavigation).WithMany(p => p.Proyectos).HasConstraintName("FK_Proyectos_AcUnidadesNegocio");
    });

    OnModelCreatingPartial(modelBuilder);
  }

  partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
