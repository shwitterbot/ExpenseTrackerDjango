from django import template

register = template.Library()

_MONTHS = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
]


@register.filter
def rub(value):
    """185000 -> «185 000 ₽» (аналог Intl.NumberFormat ru-RU, RUB)."""
    try:
        n = int(round(float(value)))
    except (TypeError, ValueError):
        return value
    sign = "-" if n < 0 else ""
    # Неразрывный пробел как разделитель тысяч.
    grouped = f"{abs(n):,}".replace(",", "\u00a0")
    return f"{sign}{grouped}\u00a0\u20bd"


@register.filter
def ru_date(value):
    """date -> «8 сентября»."""
    try:
        return f"{value.day} {_MONTHS[value.month - 1]}"
    except (AttributeError, IndexError):
        return value
