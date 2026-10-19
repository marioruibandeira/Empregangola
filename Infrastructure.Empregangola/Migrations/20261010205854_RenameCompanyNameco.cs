using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class RenameCompanyNameco : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF COL_LENGTH('Company', 'CompanyNameco') IS NOT NULL
                   AND COL_LENGTH('Company', 'CompanyName') IS NULL
                    EXEC sp_rename 'Company.CompanyNameco', 'CompanyName', 'COLUMN';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF COL_LENGTH('Company', 'CompanyName') IS NOT NULL
                   AND COL_LENGTH('Company', 'CompanyNameco') IS NULL
                    EXEC sp_rename 'Company.CompanyName', 'CompanyNameco', 'COLUMN';
            ");
        }
    }
}
