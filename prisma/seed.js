import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  PrismaClient,
  CarType,
  CarStatus,
  Gender,
  AgeGroup,
  Region,
  ContractStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const prisma = new PrismaClient();

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log('=========== 🚗 Dear Carmate Seed Start ===========');

  // DB 초기화
  await prisma.contractDocument.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log('[OK] Database cleaned');

  // 회사/관리자/직원/차량/고객/계약 샘플 데이터 생성
  const companies = [];
  const allUsers = [];
  const allCars = [];
  const allCustomers = [];

  const companySeeds = [
    { name: '테스트자동차상사', code: 'company001' },
    { name: '세컨드자동차상사', code: 'company002' },
    { name: '써드자동차상사', code: 'company003' },
  ];

  const manufacturers = ['기아', '현대', '쉐보레', 'BMW', '벤츠', '포르쉐'];
  const modelMap = {
    기아: ['K3', 'K5', 'K7', 'EV6'],
    현대: ['아반떼', '쏘나타', '그랜저', '투싼'],
    쉐보레: ['스파크', '말리부', '트랙스'],
    BMW: ['320i', '520d', 'X3'],
    벤츠: ['C클래스', 'E클래스', 'GLA'],
    포르쉐: ['718', '911', '타이칸'],
  };
  const carTypes = [
    CarType.COMPACT,
    CarType.MID_SIZE,
    CarType.LARGE,
    CarType.SPORTS_CAR,
    CarType.SUV,
  ];

  const firstNames = ['김', '이', '박', '최', '정', '강', '윤', '한'];
  const lastNames = [
    '민수',
    '서연',
    '지훈',
    '예진',
    '유진',
    '도윤',
    '시우',
    '하윤',
  ];
  const regions = [
    Region.SEOUL,
    Region.GYEONGGI,
    Region.INCHEON,
    Region.DAEJEON,
    Region.DAEGU,
    Region.BUSAN,
    Region.GWANGJU,
  ];
  const ageGroups = [
    AgeGroup.TWENTIES_20,
    AgeGroup.THIRTIES_30,
    AgeGroup.FORTIES_40,
    AgeGroup.FIFTIES_50,
  ];
  const contractStatuses = [
    ContractStatus.CAR_INSPECTION,
    ContractStatus.PRICE_NEGOTIATION,
    ContractStatus.CONTRACT_DRAFT,
    ContractStatus.CONTRACT_SUCCESSFUL,
    ContractStatus.CONTRACT_FAILED,
  ];

  // 제조사/모델별 CarModel 캐시 (중복 insert 방지)
  const carModelCache = new Map();
  const getOrCreateCarModel = async (manufacturer, model) => {
    const key = `${manufacturer}|${model}`;
    if (carModelCache.has(key)) return carModelCache.get(key);
    const carModel = await prisma.carModel.upsert({
      where: { manufacturer_model: { manufacturer, model } },
      update: {},
      create: { manufacturer, model, type: rand(carTypes) },
    });
    carModelCache.set(key, carModel);
    return carModel;
  };

  for (let cIdx = 0; cIdx < companySeeds.length; cIdx++) {
    const seed = companySeeds[cIdx];
    const company = await prisma.company.create({
      data: {
        companyName: seed.name,
        companyCode: seed.code,
      },
    });
    companies.push(company);

    // 관리자 생성
    const hashedAdminPw = await bcrypt.hash('admin1234', 10);
    const admin = await prisma.user.create({
      data: {
        name: `${seed.name}-관리자`,
        email: `admin${cIdx + 1}@test.com`,
        employeeNumber: `A00${cIdx + 1}`,
        phoneNumber: `010-10${cIdx}0-0000`,
        password: hashedAdminPw,
        isAdmin: true,
        companyId: company.id,
      },
    });
    allUsers.push(admin);

    // 직원 5명 생성
    for (let i = 1; i <= 5; i++) {
      const hashedPw = await bcrypt.hash('user1234', 10);
      const user = await prisma.user.create({
        data: {
          name: `${seed.name}-직원${i}`,
          email: `user${i}_c${cIdx + 1}@test.com`,
          employeeNumber: `E${cIdx + 1}0${i}`,
          phoneNumber: `010-${cIdx + 2}000-00${i}${i}`,
          password: hashedPw,
          isAdmin: false,
          companyId: company.id,
        },
      });
      allUsers.push(user);
    }

    // 차량 30대 생성
    const companyCars = [];
    for (let i = 0; i < 30; i++) {
      const m = rand(manufacturers);
      const model = rand(modelMap[m]);
      const carModel = await getOrCreateCarModel(m, model);
      const car = await prisma.car.create({
        data: {
          company: { connect: { id: company.id } },
          carNumber: `${cIdx + 1}${randInt(10, 99)}가${randInt(1000, 9999)}`,
          carModel: { connect: { id: carModel.id } },
          manufacturingYear: randInt(2015, 2024),
          mileage: randInt(10000, 150000),
          price: randInt(5000000, 50000000),
          accidentCount: randInt(0, 3),
          status: CarStatus.POSSESSION,
        },
      });
      companyCars.push(car);
      allCars.push(car);
    }

    // 고객 20명 생성
    const companyCustomers = [];
    for (let i = 0; i < 20; i++) {
      const customer = await prisma.customer.create({
        data: {
          companyId: company.id,
          name: rand(firstNames) + rand(lastNames),
          gender: rand([Gender.MALE, Gender.FEMALE]),
          phoneNumber: `010-${cIdx + 5}${randInt(100, 999)}-${randInt(1000, 9999)}`,
          ageGroup: rand(ageGroups),
          region: rand(regions),
          email: `customer${i}_c${cIdx + 1}@test.com`,
          memo: rand(['', 'VIP 관심 고객', '재방문 의사 있음']),
        },
      });
      companyCustomers.push(customer);
      allCustomers.push(customer);
    }

    // 계약 10~20개 생성 (랜덤 연결)
    const contractCount = randInt(10, 20);
    for (let i = 0; i < contractCount; i++) {
      const meetingDate = new Date(
        Date.now() + randInt(1, 14) * 24 * 60 * 60 * 1000
      );
      const alarmOffsetHours = randInt(1, 6);
      const customer = rand(companyCustomers);
      const car = rand(companyCars);
      const user = rand(allUsers.filter((u) => u.companyId === company.id));

      await prisma.contract.create({
        data: {
          companyId: company.id,
          userId: user.id,
          customerId: customer.id,
          carId: car.id,
          status: rand(contractStatuses),
          contractPrice: randInt(5000000, 50000000),
          resolutionDate: meetingDate,
          meetings: {
            create: [
              {
                date: meetingDate,
                alarms: {
                  create: [
                    {
                      alarmAt: new Date(
                        meetingDate.getTime() -
                          alarmOffsetHours * 60 * 60 * 1000
                      ),
                    },
                  ],
                },
              },
            ],
          },
        },
      });
    }

    console.log(
      `[OK] ${seed.name}: 1 admin, 5 users, ${companyCars.length} cars, ${companyCustomers.length} customers, ${contractCount} contracts`
    );
  }

  console.log('=========== 🚕 Dear Carmate Seed Complete ===========');
}

main()
  .catch((e) => {
    console.error('❌ Seed Failed:', e);
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
