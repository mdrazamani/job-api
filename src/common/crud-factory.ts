import { Repository, ILike, FindOptionsWhere, FindOptionsOrder, DeepPartial, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { BadRequestError, NotFoundError } from '@/utils/error-handler';

export function createCrudService<T extends { id: number }>(repo: Repository<T>) {
    return {
        async create(data: DeepPartial<T>): Promise<T> {
            if (Array.isArray(data)) {
                throw new BadRequestError('Expected a single object, but received an array', 'CrudService');
            }
            const entity = repo.create(data);
            return await repo.save(entity);
        },

        async update(id: number, data: Partial<T>): Promise<T> {
            await repo.update(id, data as any);
            const entity = await repo.findOneBy({ id } as FindOptionsWhere<T>);
            if (!entity) {
                throw new NotFoundError(`Entity with ID ${id} not found`, 'CrudService');
            }
            return entity;
        },

        async delete(id: number): Promise<void> {
            const result = await repo.delete(id);
            if (result.affected === 0) {
                throw new NotFoundError(`Entity with ID ${id} not found`, 'CrudService');
            }
        },

        async getById(id: number): Promise<T> {
            const entity = await repo.findOneBy({ id } as FindOptionsWhere<T>);
            if (!entity) {
                throw new NotFoundError(`Entity with ID ${id} not found`, 'CrudService');
            }
            return entity;
        },

        async getAll(query: Record<string, any>): Promise<{
            data: T[];
            total: number;
            page: number;
            perPage: number;
        }> {
            const { page = 1, limit = 10, minSalary, maxSalary, ...filters } = query;
            const where: FindOptionsWhere<T> = {};
            const columns = repo.metadata.columns.map((col) => col.propertyName);

            if (minSalary !== undefined && columns.includes('salaryMin')) {
                (where as any).salaryMin = MoreThanOrEqual(Number(minSalary));
            }

            if (maxSalary !== undefined && columns.includes('salaryMax')) {
                (where as any).salaryMax = LessThanOrEqual(Number(maxSalary));
            }

            for (const key of Object.keys(filters)) {
                const value = filters[key];
                if (!columns.includes(key)) continue;
                if (value === undefined || value === null) continue;

                const type = repo.metadata.findColumnWithPropertyName(key)?.type;

                if (type === 'int' || type === Number) {
                    (where as any)[key] = Number(value);
                } else if (type === Boolean || type === 'bool') {
                    (where as any)[key] = value === 'true' || value === true;
                } else {
                    (where as any)[key] = ILike(`%${value}%`);
                }
            }

            const [data, total] = await repo.findAndCount({
                where,
                take: Number(limit),
                skip: (Number(page) - 1) * Number(limit),
                order: { id: 'DESC' } as FindOptionsOrder<T>
            });

            return {
                data,
                total,
                page: Number(page),
                perPage: Number(limit)
            };
        }
    };
}
