using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    public partial class ConvertVacancyEnumsToInt : Migration
    {
        private static readonly string[] Colunas =
       {
            "ContractType", "WorkMode", "EducationLevel",
            "MinimumExperience", "ApplicationMethod", "Status"
        };
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            foreach (var coluna in Colunas)
            {
                migrationBuilder.Sql($@"
                IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                           WHERE TABLE_NAME = 'Vacancies'
                             AND COLUMN_NAME = '{coluna}'
                             AND DATA_TYPE IN ('nvarchar', 'varchar'))
                    ALTER TABLE dbo.Vacancies ALTER COLUMN {coluna} int NOT NULL;
            ");
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
