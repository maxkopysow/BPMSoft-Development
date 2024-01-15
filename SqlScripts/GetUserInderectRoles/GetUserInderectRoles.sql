CREATE PROCEDURE GetUserIndirectRoles
    @UserId uniqueidentifier
AS
BEGIN
    -- Временная таблица для хранения результатов
    CREATE TABLE #IndirectRoles ([RoleId] uniqueidentifier);

    -- Добавление прямых ролей пользователя во временную таблицу
    INSERT INTO #IndirectRoles ([RoleId])
    SELECT [SysRoleId]
    FROM [SysUserInRole]
    WHERE [SysUserId] = @UserId;

    -- Рекурсивное добавление косвенных ролей во временную таблицу
    WHILE @@ROWCOUNT > 0
    BEGIN
        -- Добавление новых ролей, в которые входят роли из временной таблицы
        INSERT INTO #IndirectRoles ([RoleId])
        SELECT [SysAdminUnitRoleId]
        FROM [SysAdminUnitInRole]
        WHERE [SourceAdminUnitId] IN (SELECT [RoleId] FROM #IndirectRoles)
          AND [SysAdminUnitRoleId] NOT IN (SELECT [RoleId] FROM #IndirectRoles);

        -- Удаление дубликатов из временной таблицы
        DELETE FROM #IndirectRoles
        WHERE [RoleId] IN (SELECT [RoleId] FROM #IndirectRoles GROUP BY [RoleId] HAVING COUNT(*) > 1);
    END

    -- Вывод списка названий косвенных ролей
    SELECT [Name]
    FROM [SysAdminUnit]
    WHERE [Id] IN (SELECT [RoleId] FROM #IndirectRoles);

    -- Удаление временной таблицы
    DROP TABLE #IndirectRoles;
END