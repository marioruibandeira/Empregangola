using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Empregangola.Interfaces
{
    public interface IBaseService<T>
    {
        Task<T> Create(T entity);
        Task<T> GetById(Guid id);
        Task<IEnumerable<T>> GetAll();
        Task<bool> Update(T entity);
        Task<bool> Delete(Guid id);
    }
}
