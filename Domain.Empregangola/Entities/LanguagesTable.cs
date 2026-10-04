using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Empregangola.Entities;

[Table("Languages")]
public class LanguagesTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int LanguagesId { get; set; }

    [Required, MaxLength(50)]
    public string Name { get; set; }
}