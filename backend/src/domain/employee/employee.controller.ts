import { Controller, Get, Post, Body } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAll() {
    return this.employeeService.findAll();
  }

  @Post()
  async create(@Body('name') name: string) {
    return this.employeeService.create(name);
  }
}
