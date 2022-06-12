import { rmSync } from 'fs';
import { join } from 'path';
import { DataSource, getConnection } from 'typeorm';
import { User } from '../src/users/user.entity';
import { Report } from '../src/reports/report.entity';

export const myDataSource = new DataSource({
  type: 'sqlite',
  database: 'test.sqlite',
  synchronize: true,
  entities: [User, Report],
});

global.beforeEach(async () => {
  try {
    await rmSync(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});

global.afterEach(async () => {
    const conn = await getConnection();
    console.log('>>>> con', conn);
    conn.destroy();
});
