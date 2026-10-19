//using Application.Empregangola.Features.Vacancy.Commands.CreateVacancy;
//using Domain.Empregangola.Entities;
//using Domain.Empregangola.Interfaces;
//using Microsoft.AspNetCore.Identity;
//using Moq;
//using Xunit;

//namespace Empregangola.Tests.Application.Tests.Features.Vacancies.Commands;

//public class CreateVacanciesTest
//{
//    private readonly Mock<IVacanciesRepository> _vacancyRepositoryMock;
//    private readonly UserManager<AppUser> _userManager;
//    private readonly CreateVacanciesHandler _handler;

//    public CreateVacanciesHandlerTests()
//    {
//        _vacancyRepositoryMock = new Mock<IVacanciesRepository>();

//        var userStoreMock = new Mock<IUserStore<AppUser>>();
//        _userManager = new UserManager<AppUser>(
//            userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);

//        _handler = new CreateVacanciesHandler(_vacancyRepositoryMock.Object, _userManager);
//    }

//    [Fact]
//    public async Task Handle_DeveCriarVaga_QuandoTituloNaoExiste()
//    {
//        // Arrange
//        var command = new CreateVacanciesCommand
//        {
//            CompanyId = Guid.NewGuid(),
//            Title = "Desenvolvedor Backend",
//            CategoryId = 1,
//            NumberOfVacancies = 2,
//            ContractType = "Efectivo",
//            WorkMode = "Remoto",
//            ProvinceId = 1,
//            Diaspora = false,
//            Description = "Descrição da vaga",
//            EducationLevel = "Licenciatura",
//            ExperienceLevel = "3 anos",
//            SalaryMin = 100000,
//            SalaryMax = 200000,
//            NegotiableSalary = false,
//            Deadline = DateTime.UtcNow.AddDays(30),
//            ApplicationMethod = "Plataforma",
//            ApplicationTarget = null,
//            Status = "Publicada",
//            Responsibilities = new List<string> { "Desenvolver APIs", "Rever código" },
//            Requirements = new List<string> { "C#", ".NET" },
//            Skills = new List<string> { "SQL", "Git" },
//            Benefits = new List<string> { "Seguro de saúde" }
//        };

//        var createdVacancy = new VacanciesTable
//        {
//            VacanciesId = 1,
//            CompanyId = command.CompanyId,
//            Title = command.Title,
//            CategoryId = command.CategoryId,
//            NumberOfVacancies = command.NumberOfVacancies,
//            ContractType = command.ContractType,
//            WorkMode = command.WorkMode,
//            ProvinceId = command.ProvinceId,
//            Diaspora = command.Diaspora,
//            Description = command.Description,
//            EducationLevel = command.EducationLevel,
//            ExperienceLevel = command.ExperienceLevel,
//            SalaryMin = command.SalaryMin,
//            SalaryMax = command.SalaryMax,
//            NegotiableSalary = command.NegotiableSalary,
//            Deadline = command.Deadline,
//            ApplicationMethod = command.ApplicationMethod,
//            ApplicationTarget = command.ApplicationTarget,
//            Status = command.Status,
//            CreatedAt = DateTime.UtcNow,
//            Responsibilities = command.Responsibilities
//                .Select((desc, i) => new VacancyResponsibilitiesTable { Description = desc, Order = i + 1 })
//                .ToList(),
//            Requirements = command.Requirements
//                .Select((desc, i) => new VacancyRequirementsTable { Description = desc, Order = i + 1 })
//                .ToList(),
//            Skills = command.Skills
//                .Select(s => new VacancySkillsTable { Skill = s })
//                .ToList(),
//            Benefits = command.Benefits
//                .Select(b => new VacancyBenefitsTable { Benefit = b })
//                .ToList()
//        };

//        _vacancyRepositoryMock
//            .Setup(r => r.ExistsAsync(command.Title, It.IsAny<CancellationToken>()))
//            .ReturnsAsync(false);

//        _vacancyRepositoryMock
//            .Setup(r => r.CreateAsync(It.IsAny<VacanciesTable>(), It.IsAny<CancellationToken>()))
//            .ReturnsAsync(createdVacancy);

//        // Act
//        var response = await _handler.Handle(command, CancellationToken.None);

//        // Assert
//        Assert.Equal(createdVacancy.VacanciesId, response.VacanciesId);
//        Assert.Equal(command.Title, response.Title);
//        Assert.Equal(2, response.Responsibilities.Count);
//        Assert.Equal("Desenvolver APIs", response.Responsibilities[0]);
//        Assert.Equal(2, response.Requirements.Count);
//        Assert.Single(response.Skills);
//        Assert.Single(response.Benefits);

//        _vacancyRepositoryMock.Verify(
//            r => r.CreateAsync(It.IsAny<VacanciesTable>(), It.IsAny<CancellationToken>()),
//            Times.Once);
//    }
//}
