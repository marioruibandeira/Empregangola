using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class correcaoFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ===== Drop FKs that point at columns we're about to rebuild =====
            migrationBuilder.DropForeignKey(
                name: "FK_Company_ActivitySector_ActivitySectorId1",
                table: "Company");

            migrationBuilder.DropForeignKey(
                name: "FK_Company_Country_CountryPaidId",
                table: "Company");

            migrationBuilder.DropForeignKey(
                name: "FK_Company_EmployeeCount_EmployeeCountId1",
                table: "Company");

            // NEW: CompanyInterest.InterestId references Interest's PK — must drop before
            // we can drop PK_Interest below.
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyInterest_Interest_InterestId",
                table: "CompanyInterest");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Country",
                table: "Country");

            migrationBuilder.DropIndex(
                name: "IX_Company_ActivitySectorId1",
                table: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Company_CountryPaidId",
                table: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Company_EmployeeCountId1",
                table: "Company");

            migrationBuilder.DropColumn(
                name: "PaidId",
                table: "Country");

            migrationBuilder.DropColumn(
                name: "ActivitySectorId1",
                table: "Company");

            migrationBuilder.DropColumn(
                name: "CountryPaidId",
                table: "Company");

            migrationBuilder.DropColumn(
                name: "EmployeeCountId1",
                table: "Company");

            migrationBuilder.RenameColumn(
                name: "Sigla",
                table: "Country",
                newName: "Acronym");

            migrationBuilder.RenameColumn(
                name: "Pais",
                table: "Country",
                newName: "Country");

            // ===== Position — drop PK, drop column, re-add as IDENTITY, re-add PK =====
            migrationBuilder.DropPrimaryKey(
                name: "PK_Position",
                table: "Position");

            migrationBuilder.DropColumn(
                name: "PositionId",
                table: "Position");

            migrationBuilder.AddColumn<int>(
                name: "PositionId",
                table: "Position",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Position",
                table: "Position",
                column: "PositionId");

            // ===== Interest — drop PK, drop column, re-add as IDENTITY, re-add PK =====
            migrationBuilder.DropPrimaryKey(
                name: "PK_Interest",
                table: "Interest");

            migrationBuilder.DropColumn(
                name: "InterestId",
                table: "Interest");

            migrationBuilder.AddColumn<int>(
                name: "InterestId",
                table: "Interest",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Interest",
                table: "Interest",
                column: "InterestId");

            // ===== EmployeeCount — drop PK, drop column, re-add as IDENTITY, re-add PK =====
            migrationBuilder.DropPrimaryKey(
                name: "PK_EmployeeCount",
                table: "EmployeeCount");

            migrationBuilder.DropColumn(
                name: "EmployeeCountId",
                table: "EmployeeCount");

            migrationBuilder.AddColumn<int>(
                name: "EmployeeCountId",
                table: "EmployeeCount",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EmployeeCount",
                table: "EmployeeCount",
                column: "EmployeeCountId");

            // Country — EF already generated this correctly (drop+add pattern, not AlterColumn)
            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "Country",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            // CompanyInterest.InterestId — Guid cannot be converted to int (no conversion
            // path exists in SQL Server), and the old Guid values are meaningless anyway
            // since Interest's PK was already replaced with fresh identity values above.
            // So: drop the index, drop the column, add it back fresh as plain int, recreate the index.
            migrationBuilder.DropIndex(
                name: "IX_CompanyInterest_InterestId",
                table: "CompanyInterest");

            migrationBuilder.DropColumn(
                name: "InterestId",
                table: "CompanyInterest");

            migrationBuilder.AddColumn<int>(
                name: "InterestId",
                table: "CompanyInterest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_CompanyInterest_InterestId",
                table: "CompanyInterest",
                column: "InterestId");

            // ===== CompanyInterest.CompanyInterestId (PK) — drop, drop column, re-add as IDENTITY, re-add PK =====
            migrationBuilder.DropPrimaryKey(
                name: "PK_CompanyInterest",
                table: "CompanyInterest");

            migrationBuilder.DropColumn(
                name: "CompanyInterestId",
                table: "CompanyInterest");

            migrationBuilder.AddColumn<int>(
                name: "CompanyInterestId",
                table: "CompanyInterest",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompanyInterest",
                table: "CompanyInterest",
                column: "CompanyInterestId");

            // ===== ActivitySector — drop PK, drop column, re-add as IDENTITY, re-add PK =====
            migrationBuilder.DropPrimaryKey(
                name: "PK_ActivitySector",
                table: "ActivitySector");

            migrationBuilder.DropColumn(
                name: "ActivitySectorId",
                table: "ActivitySector");

            migrationBuilder.AddColumn<int>(
                name: "ActivitySectorId",
                table: "ActivitySector",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ActivitySector",
                table: "ActivitySector",
                column: "ActivitySectorId");

            // ===== Re-add PK on Country =====
            migrationBuilder.AddPrimaryKey(
                name: "PK_Country",
                table: "Country",
                column: "CountryId");

            // ===== Recreate indexes on Company for the rebuilt int FK columns =====
            migrationBuilder.CreateIndex(
                name: "IX_Company_ActivitySectorId",
                table: "Company",
                column: "ActivitySectorId");

            migrationBuilder.CreateIndex(
                name: "IX_Company_CountryId",
                table: "Company",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Company_EmployeeCountId",
                table: "Company",
                column: "EmployeeCountId");

            // ===== Recreate FKs on Company pointing at the rebuilt int columns =====
            migrationBuilder.AddForeignKey(
                name: "FK_Company_ActivitySector_ActivitySectorId",
                table: "Company",
                column: "ActivitySectorId",
                principalTable: "ActivitySector",
                principalColumn: "ActivitySectorId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Company_Country_CountryId",
                table: "Company",
                column: "CountryId",
                principalTable: "Country",
                principalColumn: "CountryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Company_EmployeeCount_EmployeeCountId",
                table: "Company",
                column: "EmployeeCountId",
                principalTable: "EmployeeCount",
                principalColumn: "EmployeeCountId",
                onDelete: ReferentialAction.Cascade);

            // NEW: Recreate the FK from CompanyInterest.InterestId -> Interest.InterestId.
            // Both sides are now int, so this can go back in.
            migrationBuilder.AddForeignKey(
                name: "FK_CompanyInterest_Interest_InterestId",
                table: "CompanyInterest",
                column: "InterestId",
                principalTable: "Interest",
                principalColumn: "InterestId",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Company_ActivitySector_ActivitySectorId",
                table: "Company");

            migrationBuilder.DropForeignKey(
                name: "FK_Company_Country_CountryId",
                table: "Company");

            migrationBuilder.DropForeignKey(
                name: "FK_Company_EmployeeCount_EmployeeCountId",
                table: "Company");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyInterest_Interest_InterestId",
                table: "CompanyInterest");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Country",
                table: "Country");

            migrationBuilder.DropIndex(
                name: "IX_Company_ActivitySectorId",
                table: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Company_CountryId",
                table: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Company_EmployeeCountId",
                table: "Company");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "Country");

            // ===== ActivitySector — reverse =====
            migrationBuilder.DropPrimaryKey(
                name: "PK_ActivitySector",
                table: "ActivitySector");

            migrationBuilder.DropColumn(
                name: "ActivitySectorId",
                table: "ActivitySector");

            migrationBuilder.AddColumn<Guid>(
                name: "ActivitySectorId",
                table: "ActivitySector",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_ActivitySector",
                table: "ActivitySector",
                column: "ActivitySectorId");

            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Country",
                newName: "Pais");

            migrationBuilder.RenameColumn(
                name: "Acronym",
                table: "Country",
                newName: "Sigla");

            // ===== CompanyInterest.CompanyInterestId — reverse =====
            migrationBuilder.DropPrimaryKey(
                name: "PK_CompanyInterest",
                table: "CompanyInterest");

            migrationBuilder.DropColumn(
                name: "CompanyInterestId",
                table: "CompanyInterest");

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyInterestId",
                table: "CompanyInterest",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompanyInterest",
                table: "CompanyInterest",
                column: "CompanyInterestId");

            migrationBuilder.DropIndex(
                name: "IX_CompanyInterest_InterestId",
                table: "CompanyInterest");

            migrationBuilder.DropColumn(
                name: "InterestId",
                table: "CompanyInterest");

            migrationBuilder.AddColumn<Guid>(
                name: "InterestId",
                table: "CompanyInterest",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_CompanyInterest_InterestId",
                table: "CompanyInterest",
                column: "InterestId");

            migrationBuilder.AddColumn<Guid>(
                name: "PaidId",
                table: "Country",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            // ===== EmployeeCount — reverse =====
            migrationBuilder.DropPrimaryKey(
                name: "PK_EmployeeCount",
                table: "EmployeeCount");

            migrationBuilder.DropColumn(
                name: "EmployeeCountId",
                table: "EmployeeCount");

            migrationBuilder.AddColumn<Guid>(
                name: "EmployeeCountId",
                table: "EmployeeCount",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_EmployeeCount",
                table: "EmployeeCount",
                column: "EmployeeCountId");

            // ===== Interest — reverse =====
            migrationBuilder.DropPrimaryKey(
                name: "PK_Interest",
                table: "Interest");

            migrationBuilder.DropColumn(
                name: "InterestId",
                table: "Interest");

            migrationBuilder.AddColumn<Guid>(
                name: "InterestId",
                table: "Interest",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Interest",
                table: "Interest",
                column: "InterestId");

            // ===== Position — reverse =====
            migrationBuilder.DropPrimaryKey(
                name: "PK_Position",
                table: "Position");

            migrationBuilder.DropColumn(
                name: "PositionId",
                table: "Position");

            migrationBuilder.AddColumn<Guid>(
                name: "PositionId",
                table: "Position",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Position",
                table: "Position",
                column: "PositionId");

            migrationBuilder.AddColumn<Guid>(
                name: "ActivitySectorId1",
                table: "Company",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CountryPaidId",
                table: "Company",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "EmployeeCountId1",
                table: "Company",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Country",
                table: "Country",
                column: "PaidId");

            migrationBuilder.CreateIndex(
                name: "IX_Company_ActivitySectorId1",
                table: "Company",
                column: "ActivitySectorId1");

            migrationBuilder.CreateIndex(
                name: "IX_Company_CountryPaidId",
                table: "Company",
                column: "CountryPaidId");

            migrationBuilder.CreateIndex(
                name: "IX_Company_EmployeeCountId1",
                table: "Company",
                column: "EmployeeCountId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Company_ActivitySector_ActivitySectorId1",
                table: "Company",
                column: "ActivitySectorId1",
                principalTable: "ActivitySector",
                principalColumn: "ActivitySectorId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Company_Country_CountryPaidId",
                table: "Company",
                column: "CountryPaidId",
                principalTable: "Country",
                principalColumn: "PaidId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Company_EmployeeCount_EmployeeCountId1",
                table: "Company",
                column: "EmployeeCountId1",
                principalTable: "EmployeeCount",
                principalColumn: "EmployeeCountId",
                onDelete: ReferentialAction.Cascade);

            // NEW: Recreate the FK from CompanyInterest.InterestId -> Interest.InterestId
            // (both sides back to Guid at this point in Down())
            migrationBuilder.AddForeignKey(
                name: "FK_CompanyInterest_Interest_InterestId",
                table: "CompanyInterest",
                column: "InterestId",
                principalTable: "Interest",
                principalColumn: "InterestId",
                onDelete: ReferentialAction.NoAction);
        }
    }
}