import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { hasAnyRoles } from 'util/auth';

const employeeHardCode = {
  // delete
  id: 1,
  name: 'Carlos',
  email: 'carlos@gmail.com',
  department: {
    id: 1,
    name: 'Sales',
  },
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  const getEmployees = (pageNumber: number) => {
    const params: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      withCredentials: true,
      params: {
        page: pageNumber,
        size: 12,
      },
    };

    requestBackend(params).then((response) => {
      setPage(response.data);
    });
  };

  useEffect(() => {
    getEmployees(0);
  }, []);

  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) && (
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      )}

      <div className="row">
        {page?.content.map((employee) => (
          <div key={employee.id} className="col-sm-6 col-md-12">
            <EmployeeCard employee={employee} />
          </div>
        ))}
      </div>

      <div className="row">
        <Pagination
          pageCount={page ? page.totalPages : 0}
          range={3}
          onChange={getEmployees}
        />
      </div>
    </>
  );
};

export default List;
