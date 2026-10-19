using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class RenameExperienceLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF COL_LENGTH('Vacancies', 'ExperienceLevel') IS NOT NULL
                   AND COL_LENGTH('Vacancies', 'MinimumExperience') IS NULL
                    EXEC sp_rename 'Vacancies.ExperienceLevel', 'MinimumExperience', 'COLUMN';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF COL_LENGTH('Vacancies', 'MinimumExperience') IS NOT NULL
                   AND COL_LENGTH('Vacancies', 'ExperienceLevel') IS NULL
                    EXEC sp_rename 'Vacancies.MinimumExperience', 'ExperienceLevel', 'COLUMN';
            ");
        }
    }
}
