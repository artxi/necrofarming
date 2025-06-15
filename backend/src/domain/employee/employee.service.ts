import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from './employee.schema';

@Injectable()
export class EmployeeService {
  constructor(@InjectModel(Employee.name) private employeeModel: Model<Employee>) {}

  async findAll() {
    return this.employeeModel.find();
  }

  async create(name: string) {
    return this.employeeModel.create({ name });
  }
}
