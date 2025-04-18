using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Common.Models;

[Index("CvCtaCancelacionIngresosClientes", Name = "IX_Proyectos_11")]
public partial class Project
{
    [Key]
    public int IdProyecto { get; set; }

    [Column("Proyecto")]
    [StringLength(30)]
    [Unicode(false)]
    public string Proyecto1 { get; set; } = null!;

    [Column("idUnidadNegocio")]
    public int? IdUnidadNegocio { get; set; }

    public int? IdInmobiliaria { get; set; }

    public int? IdConstructora { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string? Nombre { get; set; }

    [StringLength(80)]
    [Unicode(false)]
    public string? Direccion { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? Colonia { get; set; }

    public int IdCiudad { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? Delegacion { get; set; }

    [StringLength(6)]
    [Unicode(false)]
    public string? CodigoPostal { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? Telefono { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? Fax { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Mail { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? LugEntrMat { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Servidor { get; set; }

    [Column("RutaPresupPU")]
    [StringLength(256)]
    [Unicode(false)]
    public string? RutaPresupPu { get; set; }

    [StringLength(256)]
    [Unicode(false)]
    public string? RutaPresupCliente { get; set; }

    [StringLength(256)]
    [Unicode(false)]
    public string? RutaPresupPrototipo { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? FechaInicio { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? FechaFinal { get; set; }

    public short SemanaLaboral { get; set; }

    public short NumPeriodos { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? HoraLabIni { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? HoraLabFin { get; set; }

    public short Periodicidad { get; set; }

    [StringLength(256)]
    [Unicode(false)]
    public string? Observac { get; set; }

    public bool ExplosionCerrada { get; set; }

    public bool TipoPresup { get; set; }

    public bool Cerrado { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? RutaAutoCad { get; set; }

    public bool Finiquitado { get; set; }

    public int? IdAutorizo { get; set; }

    public int? IdReviso { get; set; }

    public int? IdResponsable { get; set; }

    public int? IdContabilidad { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? Ansi { get; set; }

    public int? AvanceSegunSofol { get; set; }

    public int? ColorRelleno { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? FechaFinalProy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? FechaInicioProy { get; set; }

    public bool PertCalculado { get; set; }

    public int? TipoRelleno { get; set; }

    [Column("PorcentajeIVA", TypeName = "money")]
    public decimal? PorcentajeIva { get; set; }

    [StringLength(256)]
    [Unicode(false)]
    public string? RutaNomina { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Fraccionamiento { get; set; }

    [StringLength(38)]
    [Unicode(false)]
    public string? Referencia { get; set; }

    [StringLength(38)]
    [Unicode(false)]
    public string? NoConsecutivo { get; set; }

    [Column("CvIVA", TypeName = "smallmoney")]
    public decimal? CvIva { get; set; }

    public int? CvCtaDepPorIdentificar { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? FechaMovAlm { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? PresupTopeLote { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime FechaRequisicion { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime FechaPedido { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime FechaFacturaProveedor { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime FechaFacturaCliente { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime FechaCheque { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime FechaContabilidad { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime FechaSubContratos { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime FechaEstimaciones { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DiaCapturaAlmacen { get; set; }

    public bool RequiereCalcular { get; set; }

    public int MesCostoPromedio { get; set; }

    public int? IdTipoProyecto { get; set; }

    public int? ProyectoPadre { get; set; }

    [Column(TypeName = "money")]
    public decimal MontoCorridaFinanciera { get; set; }

    [Column("IdUNegociogeo")]
    public int? IdUnegociogeo { get; set; }

    public bool ValidaEstimacion { get; set; }

    public int? CuentaInterCentro { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CvRazonSocial { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CvFechaBloqueoApartados { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CvFechaBloqueoDepositos { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CvFechaBloqueoPagos { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CvFechaBloqueoEscrituras { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CvFechaBloqueoDepSofoles { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CvFechaBloqueoCancelaciones { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CvFechaBloqueoNotasCreditoCargo { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CvFechaBloqueoAjustesClientes { get; set; }

    public int? CvCtaApartados { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? CvNoCreditoPuente { get; set; }

    public int? CvIdSofolPuente { get; set; }

    public int? CvIdNotariaPuente { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? CvNoEscrituraPuente { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CvFechaFirmaPuente { get; set; }

    public int? CvIdTipoMonedaPuente { get; set; }

    [Column(TypeName = "money")]
    public decimal CvMontoCreditoPuente { get; set; }

    public int CvNoViviendasPuente { get; set; }

    [Column("ControladoXPrograma")]
    public bool ControladoXprograma { get; set; }

    public int? CvCtaIntereses { get; set; }

    public int? CvCtaGastosAdicionales { get; set; }

    public int? CvCtaMoratorios { get; set; }

    public bool AoModificarPresupC { get; set; }

    [Column("AoAgregarOCPresupC")]
    public bool AoAgregarOcpresupC { get; set; }

    public bool AoModificarSubcontratos { get; set; }

    [Column("AoAgregarOCSubcontratos")]
    public bool AoAgregarOcsubcontratos { get; set; }

    public bool AoAgregarSubcontratos { get; set; }

    public bool AoModificarEstimaciones { get; set; }

    public bool AoAgregarEstimaciones { get; set; }

    public bool AoModificarMovAlmacen { get; set; }

    public bool AoAgregarMovAlmacen { get; set; }

    public bool AcRequisiciones { get; set; }

    [Column("AcOCompra")]
    public bool AcOcompra { get; set; }

    public bool AoValidarCostoSubcontrato { get; set; }

    public bool AoValidarCostoDestajo { get; set; }

    public bool AcFacturas { get; set; }

    public bool AcContabilidad { get; set; }

    public int? CvCtaIvaTrasladado { get; set; }

    public int? CvCtaIvaTrasladadoPorAplicar { get; set; }

    public int CvConsecutivoCuentasClientes { get; set; }

    public int? CvCtaDevolucionesClientes { get; set; }

    public int? CvCtaIngresosPorCancelaciones { get; set; }

    public int? CvCtaAnticiposClientes { get; set; }

    public int? CvCtaClientes { get; set; }

    public bool FacturaTopadaVsExplosion { get; set; }

    public bool AgregarInsumosExplosion { get; set; }

    public int? CvCtaIngresosPorVentasCasas { get; set; }

    public int? CvCtaIngresosPorVentasTerrenos { get; set; }

    public int? CvCtaTraspasoCostoPorCasas { get; set; }

    public int? CvCtaTraspasoCostoPorTerrenos { get; set; }

    public int? CvCtaCostoPorCasas { get; set; }

    public int? CvCtaCostoPorTerrenos { get; set; }

    public int? IdCuentaAlmacen { get; set; }

    public int? IdTipoPolizaTraspaso { get; set; }

    public short TipoGenPolizasAlmacen { get; set; }

    public bool AcBancos { get; set; }

    public bool AoInventarioInicial { get; set; }

    public bool AcFacturasClientes { get; set; }

    public bool GenerarRequisicionesComer { get; set; }

    public bool CvGenerarReferenciasPorCredito { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? CvRutaArchivoDigitoVerificador { get; set; }

    public bool GeneraAlmacen { get; set; }

    [Column("ManejarIVAAlmacen")]
    public bool ManejarIvaalmacen { get; set; }

    [Column("IdCuentaIVAAlmacen")]
    public int? IdCuentaIvaalmacen { get; set; }

    public bool AoControlPorPrototipo { get; set; }

    public bool AoPermitirCostoContratoMayor { get; set; }

    public bool AoPermitirCostoDestajoMayor { get; set; }

    public int? CvCtaDevolucionesClientesSaldoFavor { get; set; }

    public int? CvIdFlujoDepositos { get; set; }

    public int? CvIdFlujoMoratorios { get; set; }

    public int? CvIdFlujoIntereses { get; set; }

    public int? CvIdFlujoGastosAdicionales { get; set; }

    public int? CvIdFlujoCancelaciones { get; set; }

    public int? CvIdFlujoAjustes { get; set; }

    public int? CvIdFlujoPenalizaciones { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? CvServidorAvanceObra { get; set; }

    [Column("CvBDAvanceObra")]
    [StringLength(30)]
    [Unicode(false)]
    public string? CvBdavanceObra { get; set; }

    [Column("CvUsuarioBDAvanceObra")]
    [StringLength(30)]
    [Unicode(false)]
    public string? CvUsuarioBdavanceObra { get; set; }

    [Column("CvContraseniaBDAvanceObra")]
    [StringLength(30)]
    [Unicode(false)]
    public string? CvContraseniaBdavanceObra { get; set; }

    public bool? CvAutenticacionWindowsAvanceObra { get; set; }

    public int? CvIdProyectoAvanceObra { get; set; }

    public bool AoModificarPrograma { get; set; }

    [Column("ExpInsSeCalculoEnBaseAPO")]
    public bool ExpInsSeCalculoEnBaseApo { get; set; }

    public int ExpInsPeriodoCalculo { get; set; }

    public bool RequerirPartidaEnAditivas { get; set; }

    public bool AgregarInsumosMatriz { get; set; }

    public bool PasarseExpInsMatriz { get; set; }

    [Column("CvIdFLujoExcedentes")]
    public int? CvIdFlujoExcedentes { get; set; }

    [Column("validarSoloVsExistencias")]
    public bool ValidarSoloVsExistencias { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CvRepresentanteLegalEmpresa { get; set; }

    [StringLength(2000)]
    [Unicode(false)]
    public string? CvActaConstitutivaEmpresa { get; set; }

    [StringLength(13)]
    [Unicode(false)]
    public string? CvRfcEmpresa { get; set; }

    [StringLength(2000)]
    [Unicode(false)]
    public string? CvEscrituraFraccionamiento { get; set; }

    [Column("ServidorImpPU2010")]
    [StringLength(50)]
    [Unicode(false)]
    public string? ServidorImpPu2010 { get; set; }

    [Column("BaseDatosImpPU2010")]
    [StringLength(50)]
    [Unicode(false)]
    public string? BaseDatosImpPu2010 { get; set; }

    [Column("UsuarioBdImpPU2010")]
    [StringLength(50)]
    [Unicode(false)]
    public string? UsuarioBdImpPu2010 { get; set; }

    [Column("ContraseniaBdImpPU2010")]
    [StringLength(50)]
    [Unicode(false)]
    public string? ContraseniaBdImpPu2010 { get; set; }

    [Column("IdPresupuestoImpPU2010")]
    public int? IdPresupuestoImpPu2010 { get; set; }

    [Column("AutenticacionImpPU2010")]
    public bool AutenticacionImpPu2010 { get; set; }

    [Column("IdMonedaImpPU2010")]
    public int? IdMonedaImpPu2010 { get; set; }

    public int? IdResponsableProyecto { get; set; }

    [Column("IdMonedaCalculadaImpPU2010")]
    public int? IdMonedaCalculadaImpPu2010 { get; set; }

    [Column("MultimonedaImpPU2010")]
    public bool MultimonedaImpPu2010 { get; set; }

    [Column(TypeName = "money")]
    public decimal CvValorPorMetroExcedente { get; set; }

    [Column(TypeName = "money")]
    public decimal CvValorDeEsquina { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CvRepresentanteLegalEmpresaApellidoPaterno { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CvRepresentanteLegalEmpresaApellidoMaterno { get; set; }

    [Column("CvEmpresaCLABE")]
    [StringLength(18)]
    [Unicode(false)]
    public string? CvEmpresaClabe { get; set; }

    [StringLength(4)]
    [Unicode(false)]
    public string? CvRepresentanteLegalLada { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? CvRepresentanteLegalTelefono { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? CvRepresentanteLegalTelefonoCelular { get; set; }

    [Column(TypeName = "money")]
    public decimal CvSalarioMinimo { get; set; }

    public int? IdUbicacionAlmacen { get; set; }

    public short TipoAlmacen { get; set; }

    public bool ValidarActividadesProgramadas { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? CvCuentaReferencia { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? CvBancoReferencia { get; set; }

    public int? IdCtaBancariaSocio1 { get; set; }

    public int? IdCtaBancariaSocio2 { get; set; }

    public int? IdCtaBancariaSocio3 { get; set; }

    public bool CierreTraspasoCosto { get; set; }

    [Column(TypeName = "money")]
    public decimal MontoFacturadoInicial { get; set; }

    [Column("PresupuestoImpPU2010")]
    [StringLength(20)]
    [Unicode(false)]
    public string? PresupuestoImpPu2010 { get; set; }

    [Column("MonedaImpPU2010")]
    public int? MonedaImpPu2010 { get; set; }

    [Column("MonedaCalculadaImpPU2010")]
    public int? MonedaCalculadaImpPu2010 { get; set; }

    [StringLength(30)]
    public string? CvRepresentanteLegalIdentificacion { get; set; }

    public bool AoActCostoCantOriImp { get; set; }

    [Column("ImportarDesdeServidorSQL")]
    public bool ImportarDesdeServidorSql { get; set; }

    [Column("ImportarDesdeLocalDB")]
    public bool ImportarDesdeLocalDb { get; set; }

    [Column("RutaArchivoLocalDB")]
    [StringLength(256)]
    [Unicode(false)]
    public string? RutaArchivoLocalDb { get; set; }

    [Column(TypeName = "money")]
    public decimal ImporteMaximoParaAutorizarPedidos { get; set; }

    [Column(TypeName = "money")]
    public decimal ImporteMaximoParaAutorizarEstimaciones { get; set; }

    public int? CvCtaCancelacionIngresosClientes { get; set; }

    public bool AoPermitirNegativosConceptos { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? ProyectoAuxiliar { get; set; }

    public int? CvCtaCancelacionInteres { get; set; }

    public bool Terminado { get; set; }

    public int? CvCtaDepositoDevolver { get; set; }

    public int? CvCtaDevolucionVenta { get; set; }

    public int? CvCtaInteresesOrdinarios { get; set; }

    public int? CvCtaInteresesMoratorios { get; set; }

    public int? CvCtaInteresesDevengados { get; set; }

    [Column("CentroCostoSTP")]
    [StringLength(50)]
    [Unicode(false)]
    public string? CentroCostoStp { get; set; }

    [Column("GeneraCargaInicialClaveSTP")]
    public bool? GeneraCargaInicialClaveStp { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CvFechaBloqueoIngresosOtros { get; set; }

    [StringLength(256)]
    [Unicode(false)]
    public string? RutaArchivoZipPuNube { get; set; }

    public bool ImportarDesdePuNube { get; set; }

    [ForeignKey("IdUnidadNegocio")]
    [InverseProperty("Proyectos")]
    public virtual BusinessUnit? IdUnidadNegocioNavigation { get; set; }
}
