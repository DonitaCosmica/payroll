using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Common.Models;

[Table("AcUnidadesNegocio")]
public partial class BusinessUnit
{
    [Key]
    public int IdUnidadNegocio { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string UnidadNegocio { get; set; } = null!;

    [StringLength(80)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [Column("Acepta_Mov")]
    public bool AceptaMov { get; set; }

    [Column("idTipoUnidadNegocio")]
    public int? IdTipoUnidadNegocio { get; set; }

    public bool PersonaMoral { get; set; }

    [Column("RFC")]
    [StringLength(15)]
    [Unicode(false)]
    public string? Rfc { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? RazonSocial { get; set; }

    [InverseProperty("IdUnidadNegocioNavigation")]
    public virtual ICollection<Project> Proyectos { get; set; } = [];
}
